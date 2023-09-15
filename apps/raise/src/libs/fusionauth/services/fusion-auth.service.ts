import FusionAuthClient, {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest as IFusionAuthChangePasswordRequest,
  RegistrationRequest as IFusionAuthRegistrationRequest,
  User as IFusionAuthUser,
  UserRegistration as IFusionAuthUserRegistration,
  LoginResponse,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { ROOT_LOGGER } from 'src/libs/root-logger';
import { logUtil } from '../../../commons/utils/log-util';
// import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import {
  appRoleToFusionAuthRoles,
  TenderAppRole,
} from '../../../tender-commons/types';
import { UpdateFusionAuthUserDto } from '../dtos/request/update-fusion-auth-user.dto';
import {
  ISendNewOrganization,
  IUserVerifyCheck,
} from '../dtos/response/validate-jwt-response';

import moment from 'moment';
import { CommonNotificationMapperResponse } from 'src/tender-commons/dto/common-notification-mapper-response.dto';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { TenderNotificationService } from '../../../notification-management/notification/services/tender-notification.service';
import { FusionAuthPasswordlessLoginErrorException } from '../exceptions/fusion.auth.passwordless.login.error.exception';
import { FusionAuthPasswordlessStartError } from '../exceptions/fusion.auth.passwordless.start.error.exception';
import { FusionAuthRegisterError } from '../exceptions/fusion.auth.register.error.exception';
import { FusionAuthVerifyEmailErrorException } from '../exceptions/fusion.auth.verify.email.error.exception';
import { LoginRequestDto } from 'src/auth/dtos';

/**
 * Nest Fusion Auth Service
 * @author RDanang (Iyoy!)
 */

export class FusionAuthRegisterProps {
  employee_name: string;
  password: string;
  mobile_number: string;
  email: string;
  user_roles: string[];
  email_verified?: boolean = false;
}
@Injectable()
export class FusionAuthService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': FusionAuthService.name,
  });

  private fusionAuthClient: FusionAuthClient;
  private fusionAuthAdminClient: FusionAuthClient;
  private fusionAuthAppId: string;
  private fusionAuthUrl: string;
  private fusionAuthTenantId: string;
  private fusionAuthAdminKey: string;
  private fusionAuthClientKey: string;

  constructor(
    private configService: ConfigService,
    private readonly notificationService: TenderNotificationService,
  ) {
    this.fusionAuthClientKey = this.configService.get(
      'fusionAuthConfig.clientKey',
    ) as string;

    this.fusionAuthAdminKey = this.configService.get(
      'fusionAuthConfig.adminKey',
    ) as string;

    this.fusionAuthUrl = this.configService.get(
      'fusionAuthConfig.baseUrl',
    ) as string;

    this.fusionAuthTenantId = this.configService.get(
      'fusionAuthConfig.tenantId',
    ) as string;

    this.fusionAuthAppId = this.configService.get(
      'fusionAuthConfig.appId',
    ) as string;

    this.fusionAuthClient = new FusionAuthClient(
      this.fusionAuthClientKey,
      this.fusionAuthUrl,
      this.fusionAuthTenantId,
    );

    this.fusionAuthAdminClient = new FusionAuthClient(
      this.fusionAuthAdminKey,
      this.fusionAuthUrl,
      this.fusionAuthTenantId,
    );
  }

  /**
   * Danang note:
   * Validate Jwt Token
   * Ref: https://fusionauth.io/docs/v1/tech/apis/jwt#validate-a-jwt
   */
  async fusionAuthValidateToken(
    token: string,
  ): Promise<ClientResponse<ValidateResponse>> {
    return await this.fusionAuthClient.validateJWT(token);
  }

  async fusionAuthLogin(
    loginRequest: LoginRequestDto,
    emailShouldBeVerified?: boolean,
  ): Promise<ClientResponse<LoginResponse>> {
    try {
      const result: ClientResponse<LoginResponse> =
        await this.fusionAuthClient.login({
          loginId: loginRequest.loginId,
          password: loginRequest.password,
          applicationId: this.fusionAuthAppId,
        });

      return result;
    } catch (error) {
      console.trace({ error });
      if (error.statusCode < 500) {
        throw new UnauthorizedException('Wrong credentials!');
      } else {
        throw new Error('Something went wrong!');
      }
    }
  }

  /* login without thorwing error when not exist */
  /* PS: login will return 204 when the email has not been verified, and 200 when it is */
  async login(email: string, password: string): Promise<boolean> {
    try {
      await this.fusionAuthClient.login({
        loginId: email,
        password: password,
        applicationId: this.fusionAuthAppId,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fusion Auth Passwordless
   * https://fusionauth.io/docs/v1/tech/apis/passwordless#start-passwordless-login
   *
   * Rember to turn on the passwordless login in the Fusion Auth Admin Panel (Api Key)
   * https://login.lovia.life/admin/api-key/
   */
  async fusionAuthPasswordlessLoginStart(
    loginId: string,
  ): Promise<string | number> {
    const baseUrl = this.fusionAuthUrl;
    const passwordlessCredsCheckUrl = baseUrl + '/api/passwordless/start';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        applicationId: this.fusionAuthAppId,
        loginId,
      },
      url: passwordlessCredsCheckUrl,
    };

    // console.log('passwordless login start options', options);

    try {
      const data = await axios(options);
      return data.data.code;
    } catch (error) {
      if (error.response.status < 500) {
        return error.response.status;
      }
      console.log('error', error.response.status);
      this.logger.error(
        "Can't start passwordless login!",
        error.response.status,
      );
      return 500;
    }
  }

  async passwordlessLoginStart(loginId: string): Promise<string> {
    const baseUrl = this.fusionAuthUrl;
    const passwordlessCredsCheckUrl = baseUrl + '/api/passwordless/start';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthClientKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        applicationId: this.fusionAuthAppId,
        loginId,
      },
      url: passwordlessCredsCheckUrl,
    };
    // console.log(logUtil(options));

    // console.log('passwordless login start options', options);

    try {
      const data = await axios(options);
      return data.data.code;
    } catch (error: any) {
      // console.trace(error);
      // console.log(logUtil(error.data));
      // console.trace(logUtil(error)\);
      this.logger.error(
        `Error when start fusionauth passwordless login detail ${error}`,
      );
      if (error.response.status === 404) {
        throw new DataNotFoundException(`User ${loginId} not found!`);
      }
      if (
        error.response.data &&
        error.response.data.fieldErrors &&
        error.response.status < 500
      ) {
        // console.log('response.data', logUtil(error.response.data));
        // this.logger.error('FusionAuth Error:', error.response.data);
        throw new FusionAuthPasswordlessStartError(
          `Field error (${[
            Object.keys(error.response.data.fieldErrors)[0],
          ]}) : ${
            error.response.data.fieldErrors[
              Object.keys(error.response.data.fieldErrors)[0]
            ][0].message
          }`,
        );
      }
      throw new FusionAuthPasswordlessStartError(`${error}`);
    }
  }

  /**
   * Fusion Auth Passwordless
   * https://fusionauth.io/docs/v1/tech/apis/passwordless#complete-a-passwordless-login
   */
  async fusionAuthPasswordlessLogin(loginCode: string) {
    const baseUrl = this.fusionAuthUrl;
    const passwordlessLoginUrl = baseUrl + '/api/passwordless/login';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        code: loginCode,
      },
      url: passwordlessLoginUrl,
    };

    // console.log('passworldess login options', options);

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {
      this.logger.error("Can't do passwordless login!", error);
      return false;
      // throw new HttpException(error.response.data, error.response.status);
    }
  }

  async passwordlessLogin(loginCode: string) {
    const baseUrl = this.fusionAuthUrl;
    const passwordlessLoginUrl = baseUrl + '/api/passwordless/login';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        code: loginCode,
      },
      url: passwordlessLoginUrl,
    };

    // console.log('passworldess login options', options);

    try {
      const data = await axios(options);
      // this.logger.log('info', `passwordless login ${logUtil(data.data)}`);
      return data.data;
    } catch (error) {
      this.logger.error(
        `Error when start fusionauth passwordless login detail ${error}`,
      );
      throw new FusionAuthPasswordlessLoginErrorException(`${error}`);
    }
  }

  async verifyEmail(loginId: string) {
    const baseUrl = this.fusionAuthUrl;
    const verifyEmailUrl = baseUrl + '/api/user/verify-email';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        userId: loginId,
      },
      url: verifyEmailUrl,
    };

    // console.log(`verify email options ${logUtil(options)}`);
    try {
      const data = await axios(options);
      // this.logger.log('info', `verify email ${logUtil(data.data)}`);
      return data.data.code;
    } catch (error) {
      this.logger.error(`Error verifying email ${error}`);
      throw new FusionAuthVerifyEmailErrorException(`${error}`);
    }
  }

  /**
   * Fusion Auth Register
   * why use raw axios post o fusion auth ?
   * reason, there's error on lib, ref: https://github.com/FusionAuth/fusionauth-typescript-client/issues/10
   */
  // async fusionAuthRegister(registerRequest: RegisterRequestDto) {
  //   const baseUrl = this.fusionAuthUrl;
  //   const registerUrl = baseUrl + '/api/user/registration/';
  //   const user: IFusionAuthUser = {
  //     email: registerRequest.email,
  //     password: registerRequest.password,
  //     firstName: registerRequest.firstName,
  //     lastName: registerRequest.lastName,
  //   };
  //   const registration: IFusionAuthUserRegistration = {
  //     applicationId: this.fusionAuthAppId,
  //   };

  //   const registrationRequest: IFusionAuthRegistrationRequest = {
  //     user,
  //     registration,
  //   };

  //   const options: AxiosRequestConfig<any> = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: this.fusionAuthAdminKey,
  //       'X-FusionAuth-TenantId': this.fusionAuthTenantId,
  //     },
  //     data: registrationRequest,
  //     url: registerUrl,
  //   };

  //   try {
  //     const data = await axios(options);

  //     return data.data;
  //   } catch (error) {
  //     if (
  //       error.response.data &&
  //       error.response.data.fieldErrors &&
  //       error.response.status < 500
  //     ) {
  //       this.logger.error('FusionAuth Error:', error.response.data);
  //       throw new BadRequestException(
  //         `Field error (${[
  //           Object.keys(error.response.data.fieldErrors)[0],
  //         ]}) : ${
  //           error.response.data.fieldErrors[
  //             Object.keys(error.response.data.fieldErrors)[0]
  //           ][0].message
  //         }`,
  //       );
  //     } else {
  //       this.logger.error('FusionAuth Error:', error);
  //       throw new Error('Something went wrong!');
  //     }
  //   }
  // }

  async fusionAuthVerifRegistration(token: string) {
    const baseUrl = this.fusionAuthUrl;
    const verifRegistrationUrl = baseUrl + '/api/user/verify-email/';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: {
        verificationId: token,
      },
      url: verifRegistrationUrl,
    };

    try {
      const { data, status } = await axios(options);

      if (status === 200) {
        this.logger.info('FusionAuth Success:', data);

        return {
          verified: true,
          message: 'The user has been verified!',
        };
      }
    } catch (error) {
      this.logger.error('FusionAuth Error:', error.response?.data);
      throw new Error('Something went wrong!');
    }
  }

  async fusionAuthDeleteUser(userId: string) {
    try {
      await this.fusionAuthAdminClient.deleteUser(userId);
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.log(
          'warn',
          "Delete user performed but user doesn't exist!",
          error,
        );
        return false;
      } else {
        this.logger.log(
          'error',
          "Something went wrong when deleting user, from fusion auth's side!",
          error,
        );
        throw new InternalServerErrorException(
          'Something went wrong when deleting user from server!',
        );
      }
    }
  }

  // always get 401 when using this method idk why, already check the key and tenant id, and the url is correct.
  // async fusionAuthDeleteUsers(userIds: string[]) {
  //   const baseUrl = this.fusionAuthUrl;
  //   const deleteBulkUrl = baseUrl + '/api/user/bulk';

  //   console.log('url', deleteBulkUrl);

  //   const payload = {
  //     hardDelete: true,
  //     userIds: [...userIds],
  //   };

  //   console.log('payload', payload);
  //   console.log('Authorization', this.fusionAuthAdminKey);
  //   console.log('X-FusionAuth-TenantId', this.fusionAuthTenantId);
  //   // Authorization: this.fusionAuthAdminKey,

  //   const options: AxiosRequestConfig<any> = {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: this.fusionAuthAdminKey,
  //       'X-FusionAuth-TenantId': this.fusionAuthTenantId,
  //     },
  //     url: deleteBulkUrl,
  //     data: payload,
  //   };

  //   try {
  //     const data = await axios(options);
  //     console.log(data);
  //   } catch (error) {
  //     // console.log(error);
  //     console.log(error.response.data);
  //   }
  // }

  async fusionAuthTenderRegisterUser(props: FusionAuthRegisterProps) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/user/registration';

    let role: string[] = ['tender_client'];

    // change the tender app role to fusion auth roles
    if (props.user_roles) {
      const tmpRoles: string[] = props.user_roles.map(
        (role) => appRoleToFusionAuthRoles[role as TenderAppRole],
      );
      role = tmpRoles;
    }

    const user: IFusionAuthUser = {
      email: props.email,
      password: props.password,
      firstName: props.employee_name,
      lastName: '',
      verified: props.email_verified || false,
    };

    if (props.mobile_number) {
      user.mobilePhone = props.mobile_number;
    }

    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
      roles: role,
      verified: props.email_verified || false,
    };

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
      skipVerification: false,
      skipRegistrationVerification: false,
    };

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      data: registrationRequest,
      url: registerUrl,
    };

    this.logger.log(
      'info',
      `trying to register user (${props.email}) to fusion auth`,
    );

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {
      if (
        error.response.data &&
        error.response.data.fieldErrors &&
        error.response.status < 500
      ) {
        this.logger.error('FusionAuth Error:', error.response.data);
        throw new FusionAuthRegisterError(
          `Field error (${[
            Object.keys(error.response.data.fieldErrors)[0],
          ]}) : ${
            error.response.data.fieldErrors[
              Object.keys(error.response.data.fieldErrors)[0]
            ][0].message
          }`,
        );
      }
      this.logger.error('FusionAuth Error:', error);
      throw new Error('Something went wrong!');
    }
  }

  async fusionUserCheck(reqPayload: IUserVerifyCheck) {
    try {
      const retrieveFusionUser = await this.fusionAuthClient.retrieveUser(
        reqPayload.user_id,
      );

      return retrieveFusionUser.response;
    } catch (error) {
      if (error && error.response.status === 404) {
        throw new NotFoundException('The User could not be found!');
      } else {
        this.logger.debug('Error', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async fusionUserCheckByEmail(email: string) {
    try {
      const retrieveFusionUser =
        await this.fusionAuthClient.retrieveUserByEmail(email);

      return retrieveFusionUser.response;
    } catch (error) {
      if (error && error.statusCode === 404) {
        throw new NotFoundException('The User could not be found!');
      } else {
        this.logger.debug('Error', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async forgotPasswordRequest(email: string): Promise<string> {
    const forgotPasswordUrl = this.fusionAuthUrl + '/api/user/forgot-password';

    const payload: ForgotPasswordRequest = {
      applicationId: this.fusionAuthAppId,
      sendForgotPasswordEmail: false,
      loginId: email,
    };

    const axiosOptions: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      url: forgotPasswordUrl,
      data: payload,
    };
    try {
      const response = await axios(axiosOptions);

      return response.data.changePasswordId;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        throw new NotFoundException('The User could not be found!');
      } else {
        this.logger.debug('Error', error);
        throw error;
      }
    }
  }

  async submitChangePassword(
    changePasswordId: string,
    newPassword: string,
    oldPassword?: string,
  ) {
    const changePasswordUrl = `${this.fusionAuthUrl}/api/user/change-password/${changePasswordId}`;
    const payload: ChangePasswordRequest = {
      applicationId: this.fusionAuthAppId,
      password: newPassword,
    };
    if (oldPassword) payload.currentPassword = oldPassword;
    const axiosOptions: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      url: changePasswordUrl,
      data: payload,
    };
    try {
      const response = await axios(axiosOptions);

      return response;
    } catch (error) {
      if (error.response.status === 404 || error.response.status === 400) {
        if (error.response.status === 404) {
          if (oldPassword) {
            throw new BadRequestException('Invalid Old Password!');
          } else {
            throw new BadRequestException('Token Expired!');
          }
        }
      } else {
        throw new Error(
          'Something went wrong when submitting change password!',
        );
      }
    }
  }

  async fusionAuthChangePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const request: IFusionAuthChangePasswordRequest = {
      applicationId: this.fusionAuthAppId,
      loginId: email,
      currentPassword: currentPassword,
      password: newPassword,
    };

    try {
      await this.fusionAuthAdminClient.changePasswordByIdentity(request);
      return true;
    } catch (err) {
      this.logger.error('Fusion Auth Change Password: ', err);
      return false;
    }
  }

  async fusionAuthUpdateUser(
    userId: string,
    updateRequest: UpdateFusionAuthUserDto,
  ) {
    const user: IFusionAuthUser = {
      firstName: updateRequest.firstName,
      password: updateRequest.password,
      email: updateRequest.email,
      mobilePhone: updateRequest.mobilePhone,
    };

    this.logger.log(
      'info',
      `updating user (${userId}) on FusionAuth, with payload : ${logUtil(
        user,
      )}`,
    );

    try {
      await this.fusionAuthAdminClient.patchUser(userId, {
        user,
      });
      return true;
    } catch (err) {
      this.logger.error('Fusion Auth Update User Error: ', err);
      return false;
    }
  }

  async fusionAuthUpdateUserRegistration(
    userId: string,
    updateRequest: UpdateFusionAuthUserDto,
  ) {
    const user: IFusionAuthUser = {
      firstName: updateRequest.firstName,
      password: updateRequest.password,
      email: updateRequest.email,
      mobilePhone: updateRequest.mobilePhone,
    };

    let roles: string[] = [];
    if (updateRequest.roles) {
      const tmpRoles: string[] = updateRequest.roles.map(
        (role) => appRoleToFusionAuthRoles[role as TenderAppRole],
      );
      roles = [...tmpRoles];
    }

    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
    };

    if (roles.length > 0) {
      registration.roles = roles;
    }

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
    };

    try {
      this.logger.log(
        'info',
        `updating user (${userId}) on FusionAuth, with payload : ${logUtil(
          user,
        )}`,
      );
      await this.fusionAuthAdminClient.patchUser(userId, {
        user,
      });

      if (roles.length > 0) {
        this.logger.log(
          'info',
          `Roles is defined, updating user  roles (${userId}) on FusionAuth, with payload : ${logUtil(
            registrationRequest,
          )}`,
        );
        await this.fusionAuthAdminClient.patchRegistration(
          userId,
          registrationRequest,
        );
      }
      return true;
    } catch (err) {
      console.trace({ err });
      this.logger.error('Fusion Auth Update User Error: ', err);
      return false;
    }
  }

  /**
   * * Tmra New Organization
   */

  async welcomingNewOrganization(requestPayload: ISendNewOrganization) {
    const notifPayload: CommonNotificationMapperResponse = {
      logTime: moment(new Date().getTime()).format('llll'),
      generalHostEmail: 'tmra',
      clientSubject: 'Welcome to TMRA',
      clientId: [],
      clientEmail: [requestPayload.email],
      clientMobileNumber: [],
      clientEmailTemplatePath: `tmra/en/register/new_organization_welcome`,
      clientEmailTemplateContext: [
        {
          organization_name: requestPayload.organization_name,
          redirect_link: requestPayload.domainUrl,
        },
      ],
      clientContent:
        "We're excited to welcome you to TMRA and we're even more excited about what we've got planned.",
      reviewerId: [],
      reviewerEmail: [],
      reviewerContent: '',
      reviewerMobileNumber: [],
      createManyWebNotifPayload: [],
    };

    await this.notificationService.sendSmsAndEmailBatch(notifPayload);
  }
}
