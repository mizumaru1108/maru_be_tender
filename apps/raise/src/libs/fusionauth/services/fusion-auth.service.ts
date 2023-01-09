import FusionAuthClient, {
  ChangePasswordRequest as IFusionAuthChangePasswordRequest,
  LoginResponse,
  RegistrationRequest as IFusionAuthRegistrationRequest,
  SendRequest,
  User as IFusionAuthUser,
  UserRegistration as IFusionAuthUserRegistration,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { ROOT_LOGGER } from 'src/libs/root-logger';
import { LoginRequestDto } from '../../../auth/dtos/login-request.dto';
import { RegisterRequestDto } from '../../../auth/dtos/register-request.dto';
// import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import {
  appRoleToFusionAuthRoles,
  TenderAppRole,
} from '../../../tender-commons/types';
import { TenderCreateUserFusionAuthDto } from '../../../tender-user/user/dtos/requests/tender-create-user-fusion-auth.dto';
import { UpdateUserPayload } from '../../../tender-user/user/interfaces/update-user-payload.interface';
import {
  IQueryAxiosVerify,
  IVerifyEmailDto,
} from '../dtos/response/validate-jwt-response';

/**
 * Nest Fusion Auth Service
 * @author RDanang (Iyoy!)
 */
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

  constructor(private configService: ConfigService) {
    const fusionAuthClientKey = this.configService.get(
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
      fusionAuthClientKey,
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
      // console.log(result);
      // !TODO: if result.statusCode = 204 the user hasn't validate their email. (STILL TO DO), using param emailShouldBeVerified.
      return result;
    } catch (error) {
      if (error.statusCode < 500) {
        throw new UnauthorizedException('Invalid credentials!');
      } else {
        throw new Error('Something went wrong!');
      }
    }
  }

  /**
   * Fusion Auth Passwordless Test 1
   */
  async fusionAuthPasswordlessLoginStart(loginId: string) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/passwordless/start';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
      },
      data: {
        applicationId: this.fusionAuthAppId,
        loginId,
      },
      url: registerUrl,
    };

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {}
  }
  /**
   * Fusion Auth Passwordless Test 2
   */
  async fusionAuthPasswordlessLogin2(registerRequest: RegisterRequestDto) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/passwordless/login';
    const user: IFusionAuthUser = {
      email: registerRequest.email,
      password: registerRequest.password,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
    };
    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
    };

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
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

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {}
  }

  /**
   * Fusion Auth Passwordless Test 3
   */
  async fusionAuthPasswordlessLogin3(registerRequest: RegisterRequestDto) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/passwordless/start';
    const user: IFusionAuthUser = {
      email: registerRequest.email,
      password: registerRequest.password,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
    };
    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
    };

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
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

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {}
  }

  /**
   * Fusion Auth Register
   * why use raw axios post o fusion auth ?
   * reason, there's error on lib, ref: https://github.com/FusionAuth/fusionauth-typescript-client/issues/10
   */
  async fusionAuthRegister(registerRequest: RegisterRequestDto) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/user/registration/';
    const user: IFusionAuthUser = {
      email: registerRequest.email,
      password: registerRequest.password,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
    };
    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
    };

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
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

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {}
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

  async fusionAuthTenderRegisterUser(
    registerRequest: TenderCreateUserFusionAuthDto,
  ) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/user/registration/';

    let role: string[] = ['tender_client'];

    // change the tender app role to fusion auth roles
    if (registerRequest.user_roles) {
      let tmpRoles: string[] = registerRequest.user_roles.map(
        (role) => appRoleToFusionAuthRoles[role as TenderAppRole],
      );
      role = tmpRoles;
    }

    const user: IFusionAuthUser = {
      email: registerRequest.email,
      password: registerRequest.password,
      firstName: registerRequest.employee_name,
      lastName: '',
    };

    if (registerRequest.mobile_number) {
      user.mobilePhone = registerRequest.mobile_number;
    }

    const registration: IFusionAuthUserRegistration = {
      applicationId: this.fusionAuthAppId,
      roles: role,
    };

    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
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
      `trying to register user (${registerRequest.email}) to fusion auth`,
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
        throw new BadRequestException(
          `Registration failed on cloud app, field error (${[
            Object.keys(error.response.data.fieldErrors)[0],
          ]}) : ${
            error.response.data.fieldErrors[
              Object.keys(error.response.data.fieldErrors)[0]
            ][0].message
          }`,
        );
      } else {
        this.logger.error('FusionAuth Error:', error);
        throw new Error('Something went wrong!');
      }
    }
  }

  async fusionEmailVerification(requestVerify: IVerifyEmailDto) {
    const baseUrl = this.fusionAuthUrl;
    const verifyUrl = baseUrl + '/api/user/verify-email';
    const sendEmailUrl = baseUrl + '/api/email/send/';
    const gsEmailTemplateId = '99732b56-521f-4da7-8792-bf97a3c13988';

    const queryVerify: IQueryAxiosVerify = {
      applicationId: this.fusionAuthAppId,
      email: requestVerify.email,
    };

    let variableSendEmail: SendRequest = {
      requestData: {
        domainUrl: requestVerify.domainUrl,
        organizationEmail: requestVerify.organizationEmail,
      },
      userIds: [requestVerify.userId],
    };

    const optionsVerify: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.fusionAuthAdminKey,
        'X-FusionAuth-TenantId': this.fusionAuthTenantId,
      },
      params: queryVerify,
      url: verifyUrl,
    };

    try {
      const { data } = await axios(optionsVerify);

      if (data && data.verificationId) {
        let actVerifyUrl: string;
        variableSendEmail.requestData!.verificationId = data.verificationId;

        requestVerify &&
        requestVerify?.organizationId === '62414373cf00cca3a830814a'
          ? (actVerifyUrl = sendEmailUrl + gsEmailTemplateId)
          : (actVerifyUrl =
              sendEmailUrl + 'f1044dc5-02a3-4c73-942b-407639fe77ae');

        const optionsSendEmail: AxiosRequestConfig<any> = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.fusionAuthAdminKey,
            'X-FusionAuth-TenantId': this.fusionAuthTenantId,
          },
          data: variableSendEmail,
          url: actVerifyUrl,
        };

        const resSendEmail = await axios(optionsSendEmail);

        if (resSendEmail.status === 202) {
          return data;
        }
      }
    } catch (error) {
      this.logger.debug('Error', error);
      if (error.response.status < 500) {
        console.log(error.response.data);
        throw new BadRequestException(
          `Verify Failed, more details: ${
            error.response.data.fieldErrors
              ? JSON.stringify(error.response.data.fieldErrors)
              : JSON.stringify(error.response.data)
          }`,
        );
      } else {
        console.log(error);
        throw new Error('Something went wrong!');
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

  async fusionAuthUpdateUser(userId: string, updateRequest: UpdateUserPayload) {
    this.logger.log('info', `updating user (${userId}) on FusionAuth`);

    const user: IFusionAuthUser = {
      firstName: updateRequest.employee_name as string | undefined,
      password: updateRequest.password as string | undefined,
      // will be enabled later on when email and phone can be updated
      // email: updateRequest.email as string | undefined,
      // mobilePhone: updateRequest.mobile_number as string | undefined,
    };

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
}
