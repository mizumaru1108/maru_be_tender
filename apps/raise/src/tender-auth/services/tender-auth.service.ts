import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from '../../auth/dtos';
import { logUtil } from '../../commons/utils/log-util';
import { EmailService } from '../../libs/email/email.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { TenderClientRepository } from '../../tender-user/client/repositories/tender-client.repository';
import { TenderClientService } from '../../tender-user/client/services/tender-client.service';
import { TenderUserRepository } from '../../tender-user/user/repositories/tender-user.repository';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { SubmitChangePasswordDto } from '../dtos/requests/submit-change-password.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';

@Injectable()
export class TenderAuthService {
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderClientService: TenderClientService,
    private readonly tenderUserRepository: TenderUserRepository,
    private readonly tenderClientRepository: TenderClientRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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
    const {
      data: {
        ceo_mobile: ceoMobile,
        data_entry_mobile: dataEntryMobile,
        entity_mobile: clientPhone,
        email,
        employee_path,
        status,
        selectLang,
      },
    } = registerRequest;

    const emailExist = await this.tenderUserRepository.findUser({
      email: registerRequest.data.email,
    });
    if (emailExist) {
      if (selectLang === 'en') {
        throw new ConflictException('Email already exist in our app!');
      } else {
        throw new ConflictException(
          'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
        );
      }
    }

    const phoneExist = await this.tenderUserRepository.findUser({
      mobile_number: clientPhone,
    });
    if (phoneExist) {
      throw new ConflictException('Entity Mobile exist in our app!');
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

    if (employee_path) {
      const pathExist = await this.tenderUserRepository.validateTrack(
        employee_path,
      );
      if (!pathExist) throw new BadRequestException('Invalid Employee Path!');
    }

    if (status) {
      const statusExist = await this.tenderClientRepository.validateStatus(
        status,
      );
      if (!statusExist) {
        throw new BadRequestException('Invalid client status!');
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

  async forgotPasswordRequest(email: string, selected_language?: 'ar' | 'en') {
    const user = await this.tenderUserRepository.findByEmail(email);
    if (!user) throw new BadRequestException('User not found!');

    const response = await this.fusionAuthService.forgotPasswordRequest(email);

    this.emailService.sendMail({
      mailType: 'template',
      to: email,
      from: 'no-reply@hcharity.org',
      subject: 'Reset Your Password',
      templateContext: {
        name: user.employee_name,
        resetUrl: `${this.configService.get<string>(
          'tenderAppConfig.baseUrl',
        )}/reset-password/${response}`,
      },
      templatePath: `tender/${
        selected_language || 'ar'
      }/account/forget_password`,
    });
    return response;
  }

  async submitChangePassword(request: SubmitChangePasswordDto) {
    await this.fusionAuthService.submitChangePassword(
      request.changePasswordId,
      request.newPassword,
      request.oldPassword,
    );
  }
}
