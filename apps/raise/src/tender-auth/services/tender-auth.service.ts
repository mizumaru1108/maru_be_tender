import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto } from '../../auth/dtos';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderClientService } from '../../tender-client/services/tender-client.service';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';

@Injectable()
export class TenderAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderClientService: TenderClientService,
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

    const userData = await this.prismaService.user.findUnique({
      where: {
        id: fusionAuthResponse.response.user.id,
      },
    });
    if (!userData) {
      throw new BadRequestException('User record not found in database');
    }

    const clientData = await this.prismaService.client_data.findUnique({
      where: {
        user_id: fusionAuthResponse.response.user.id,
      },
    });

    return {
      fusionAuthResponse,
      userData,
      clientData,
    };
  }

  async register(registerRequest: RegisterTenderDto) {
    const emailData = await this.prismaService.user.findUnique({
      where: { email: registerRequest.data.email },
    });

    if (emailData) {
      throw new BadRequestException('Email already exist');
    }

    const lisceneNumber = await this.prismaService.client_data.findFirst({
      where: { license_number: registerRequest.data.license_number },
    });

    if (lisceneNumber) {
      throw new BadRequestException('License number already exist!');
    }

    if (registerRequest.data.employee_path) {
      const track = await this.prismaService.project_tracks.findUnique({
        where: { id: registerRequest.data.employee_path },
      });
      if (!track) {
        throw new BadRequestException(
          'Invalid employee path!, Path is not found!',
        );
      }
    }

    if (registerRequest.data.status) {
      const status = await this.prismaService.client_status.findUnique({
        where: { id: registerRequest.data.status },
      });
      if (!status) {
        throw new BadRequestException('Invalid status!, Status is not found!');
      }
    }

    // create user on fusion auth
    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser({
        email: registerRequest.data.email,
        employee_name: registerRequest.data.employee_name,
        password: registerRequest.data.password,
        mobile_number: registerRequest.data.phone,
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
