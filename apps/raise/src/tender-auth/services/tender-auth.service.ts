import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto } from '../../auth/dtos';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { TenderClientRepository } from '../../tender-user/client/repositories/tender-client.repository';
import { TenderClientService } from '../../tender-user/client/services/tender-client.service';
import { TenderUserRepository } from '../../tender-user/user/repositories/tender-user.repository';
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
    // destruct data.phone from registerRequest as clientPhone
    const {
      data: {
        phone: clientPhone,
        ceo_mobile: ceoMobile,
        data_entry_mobile: dataEntryMobile,
        email,
        employee_path,
        status,
        license_number,
      },
    } = registerRequest;

    // find either client / user by email or phone
    const findDuplicated = await this.tenderUserRepository.findUser({
      OR: [
        { email: registerRequest.data.email },
        { mobile_number: clientPhone },
      ],
    });
    if (findDuplicated) {
      throw new BadRequestException('Email or Mobile Number already exist!');
    }

    if (dataEntryMobile === clientPhone) {
      throw new BadRequestException(
        'Data Entry Mobile cannot be same as Client Mobile!',
      );
    }

    if (clientPhone === ceoMobile) {
      throw new BadRequestException(
        'Phone number and CEO mobile number cannot be the same!',
      );
    }

    const isDuplicatedLiscene = await this.tenderClientRepository.findClient({
      license_number,
    });
    if (isDuplicatedLiscene) {
      throw new BadRequestException('License number already exist!');
    }

    if (employee_path) {
      const track = await this.tenderUserRepository.validateTrack(
        employee_path,
      );
      if (!track) throw new BadRequestException('Invalid Employee Path!');
    }

    if (status) {
      const duplicatedStatus = await this.tenderClientRepository.validateStatus(
        status,
      );
      if (!duplicatedStatus) {
        throw new BadRequestException('Invalid client status');
      }
    }

    // create user on fusion auth
    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser({
        email,
        employee_name: registerRequest.data.employee_name,
        password: registerRequest.data.password,
        mobile_number: clientPhone,
        user_roles: ['CLIENT'],
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
