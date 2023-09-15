import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../libs/email/email.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { TenderClientRepository } from '../../tender-user/client/repositories/tender-client.repository';
import { TenderClientService } from '../../tender-user/client/services/tender-client.service';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { SubmitChangePasswordDto } from '../dtos/requests/submit-change-password.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { TenderUserRepository } from '../../tender-user/user/repositories/tender-user.repository';
import { LoginRequestDto } from 'src/auth/dtos';

@Injectable()
export class TenderAuthService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderAuthService.name,
  });

  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderClientService: TenderClientService,
    private readonly tenderUserRepo: TenderUserRepository,
    private readonly tenderClientRepository: TenderClientRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async oldLogin(
    loginRequest: LoginRequestDto,
  ): Promise<TenderLoginResponseDto> {
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

    // const userData = await this.tenderUserRepository.findUser({
    //   id: fusionAuthResponse.response.user.id,
    // });
    // if (!userData) {
    //   throw new BadRequestException('User record not found in database');
    // }

    // const clientData = await this.tenderClientRepository.findClient({
    //   user_id: fusionAuthResponse.response.user.id,
    // });

    return {
      fusionAuthResponse,
    };
  }

  // async login(loginRequest: LoginRequestDto): Promise<any> {
  //   const { loginId, password } = loginRequest;
  //   try {
  //     // console.log({ loginId });
  //     let license_number = '';
  //     let phone_number = '';
  //     let email = '';

  //     if (/^(\+966|966)/.test(loginId)) {
  //       phone_number = loginId;
  //     } else if (/^\d+$/.test(loginId) && !/^(?:\+966|966)/.test(loginId)) {
  //       license_number = loginId;
  //     } else if (/^\S+@\S+\.\S+$/.test(loginId)) {
  //       email = loginId;
  //     }

  //     // console.log({ license_number });
  //     // console.log({ phone_number });
  //     // console.log({ email });

  //     const user = await this.tenderUserRepo.checkExistance(
  //       phone_number,
  //       email,
  //       license_number,
  //     );

  //     if (!user) {
  //       throw new UnauthorizedException('Wrong Credentials!');
  //     }

  //     // if user found then do regular login using fusion auth
  //     const fusionAuthResponse = await this.fusionAuthService.fusionAuthLogin({
  //       loginId: user.email,
  //       password,
  //     });

  //     if (
  //       !fusionAuthResponse.response.user ||
  //       !fusionAuthResponse.response.user.id
  //     ) {
  //       throw new BadRequestException(
  //         'Failed to get the user after fusion auth login!',
  //       );
  //     }

  //     return {
  //       fusionAuthResponse,
  //       user,
  //     };
  //   } catch (error) {
  //     this.logger.error('login error', error);
  //     throw error;
  //   }
  // }

  async sendEmailVerif(email: string, selectLang: 'en' | 'ar') {
    // passwordless login
    const loginCode =
      await this.fusionAuthService.fusionAuthPasswordlessLoginStart(email);
    if (typeof loginCode !== 'number') {
      // console.log({ loginCode });

      // check that email has been verified / not
      const loginResponse =
        await this.fusionAuthService.fusionAuthPasswordlessLogin(loginCode);

      // console.log('login response send email verif', loginResponse);

      if (!loginResponse.user) {
        throw new BadRequestException('User Data Not Found!');
      }

      // console.log({ loginResponse });
      if (loginResponse.user.verified) {
        return 'user already verified!';
      }

      const emailVerifiedToken =
        await this.fusionAuthService.fusionAuthPasswordlessLoginStart(email);
      console.log({ emailVerifiedToken });

      this.emailService.sendMail({
        mailType: 'template',
        to: email,
        from: 'no-reply@hcharity.org',
        subject: 'Verrify Your Email',
        templateContext: {
          name: `${email}`,
          verify_url: `${this.configService.get<string>(
            'tenderAppConfig.baseUrl',
          )}/auth/verify/${emailVerifiedToken}`,
        },
        templatePath: `tender/${selectLang || 'ar'}/account/verify_your_email`,
      });

      return 'email verification sent';
    } else {
      throw new UnauthorizedException('User not found!');
    }
  }

  async verifyEmail(token: string, selectLang?: 'en' | 'ar') {
    console.log({ token });
    try {
      const loginResponse =
        await this.fusionAuthService.fusionAuthPasswordlessLogin(token);
      console.log('verify email login response', loginResponse);

      if (!loginResponse) {
        throw new BadRequestException('invalid/expire token!');
      }

      if (!loginResponse.user) {
        throw new BadRequestException('User Data Not Found!');
      }

      if (loginResponse.user.verified) {
        throw new BadRequestException('user already verified!');
      }

      await this.fusionAuthService.verifyEmail(loginResponse.user.id);

      this.emailService.sendMail({
        mailType: 'template',
        to: loginResponse.user.email,
        from: 'no-reply@hcharity.org',
        subject: 'Email Verified',
        templateContext: {
          user_email: loginResponse.user.email,
          app_url: `${this.configService.get<string>(
            'tenderAppConfig.baseUrl',
          )}`,
        },
        templatePath: `tender/${selectLang || 'ar'}/account/email_verified`,
      });
      return 'user verified';
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /* create user with client data */
  async register(registerRequest: RegisterTenderDto) {
    try {
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

      const emailExist = await this.tenderUserRepo.findUser({
        email: registerRequest.data.email,
      });
      // console.log({ emailExist });
      if (emailExist) {
        if (selectLang === 'en') {
          throw new ConflictException('Email already exist in our app!');
        } else {
          throw new ConflictException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      const phoneExist = await this.tenderUserRepo.findUser({
        mobile_number: dataEntryMobile,
      });
      if (phoneExist) {
        throw new ConflictException('Data Entry exist in our app!');
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
        const pathExist = await this.tenderUserRepo.validateTrack(
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
          mobile_number: dataEntryMobile,
          // mobile_number: clientPhone,
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async askForgotPasswordUrl(email: string) {
    const user = await this.tenderUserRepo.findByEmail(email);
    if (!user) throw new BadRequestException('User not found!');

    const response = await this.fusionAuthService.forgotPasswordRequest(email);

    return `${this.configService.get<string>(
      'tenderAppConfig.baseUrl',
    )}/auth/forgot-password/${response}`;
  }

  async changePasswordRequest(
    email: string,
    forgotPassword: boolean,
    selected_language?: 'ar' | 'en',
  ) {
    const user = await this.tenderUserRepo.findByEmail(email);
    if (!user) throw new BadRequestException('User not found!');

    const response = await this.fusionAuthService.forgotPasswordRequest(email);

    this.emailService.sendMail({
      mailType: 'template',
      to: email,
      from: 'no-reply@hcharity.org',
      subject: forgotPassword
        ? 'Forgot Password Request'
        : 'Reset Password Request',
      templateContext: {
        name: user.employee_name,
        resetUrl: forgotPassword
          ? `${this.configService.get<string>(
              'tenderAppConfig.baseUrl',
            )}/auth/forgot-password/${response}`
          : `${this.configService.get<string>(
              'tenderAppConfig.baseUrl',
            )}/auth/reset-password/${response}`,
      },
      templatePath: `tender/${selected_language || 'ar'}/account/${
        forgotPassword ? 'forget_password' : 'reset_password'
      }`,
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
