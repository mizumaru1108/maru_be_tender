import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto } from '../../auth/dtos';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderClientRepository } from '../../tender-user/client/repositories/tender-client.repository';
import { TenderUserRepository } from '../../tender-user/user/repositories/tender-user.repository';
import { TenderClientService } from '../../tender-user/client/services/tender-client.service';
import { TenderUserService } from '../../tender-user/user/services/tender-user.service';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';

@Injectable()
export class TenderAuthService {
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderClientService: TenderClientService,
    private readonly tenderUserRepository: TenderUserRepository,
    private readonly tenderClientRepository: TenderClientRepository,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<TenderLoginResponseDto> {
    const fusionAuthResponse = await this.fusionAuthService.fusionAuthLogin(
      loginRequest,
    );

    if (
      !fusionAuthResponse.response.user ||
      !fusionAuthResponse.response.user.id
    ) {
      throw new BadRequestException(
        'Failed to get the user after fusion auth login!',
      );
    }

    const userData = await this.tenderUserRepository.findUser({
      id: fusionAuthResponse.response.user.id,
    });
    if (!userData) {
      throw new BadRequestException('User record not found in database');
    }

    const clientData = await this.tenderClientRepository.findClient({
      user_id: fusionAuthResponse.response.user.id,
    });

    return {
      fusionAuthResponse,
      userData,
      clientData,
    };
  }

  /* create user with client data */
  async register(registerRequest: RegisterTenderDto) {
    const findDuplicated = await this.tenderUserRepository.findUser({
      OR: [
        { email: registerRequest.data.email },
        { mobile_number: registerRequest.data.phone },
      ],
    });
    if (findDuplicated) {
      throw new BadRequestException('Email or Mobile Number already exist!');
    }

    const lisceneNumber = await this.tenderClientRepository.findClient({
      license_number: registerRequest.data.license_number,
    });
    if (lisceneNumber) {
      throw new BadRequestException('License number already exist!');
    }

    if (registerRequest.data.employee_path) {
      const track = await this.tenderUserRepository.validateTrack(
        registerRequest.data.employee_path,
      );
      if (!track) throw new BadRequestException('Invalid Employee Path!');
    }

    if (registerRequest.data.status) {
      const status = await this.tenderClientRepository.validateStatus(
        registerRequest.data.status,
      );
      if (!status) throw new BadRequestException('Invalid client status');
    }

    // create user on fusion auth
    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser({
        email: registerRequest.data.email,
        employee_name: registerRequest.data.employee_name,
        password: registerRequest.data.password,
        mobile_number: registerRequest.data.phone,
        user_roles: 'CLIENT',
      });

    // if you want to make a type for register result
    // see trough mr danang soluvas note, theres' fustion auth register result type there for details.
    if (!fusionAuthResult.user.id) {
      throw new BadRequestException(
        'Failed to get the user id after creating fusion auth account!',
      );
    }

    const result = await this.tenderClientService.createUserAndClient(
      fusionAuthResult.user.id,
      registerRequest,
    );

    return result;
  }
}
