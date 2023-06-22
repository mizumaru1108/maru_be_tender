import FusionAuthClient, {
  ChangePasswordRequest as IFusionAuthChangePasswordRequest,
  LoginResponse,
  RegistrationRequest as IFusionAuthRegistrationRequest,
  User as IFusionAuthUser,
  UserRegistration as IFusionAuthUserRegistration,
  ValidateResponse,
  ForgotPasswordRequest,
  ChangePasswordRequest,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { ROOT_LOGGER } from 'src/libs/root-logger';
import { LoginRequestDto } from '../../../auth/dtos/login-request.dto';
import { RegisterRequestDto } from '../../../auth/dtos/register-request.dto';
import { logUtil } from '../../../commons/utils/log-util';
// import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import {
  appRoleToFusionAuthRoles,
  TenderAppRole,
} from '../../../tender-commons/types';
import { TenderCreateUserFusionAuthDto } from '../../../tender-user/user/dtos/requests/tender-create-user-fusion-auth.dto';
import { UpdateUserPayload } from '../../../tender-user/user/interfaces/update-user-payload.interface';
import { UpdateFusionAuthUserDto } from '../dtos/request/update-fusion-auth-user.dto';
import {
  IQueryAxiosVerify,
  IVerifyEmailDto,
  IUserVerifyCheck,
  ISendNewOrganization,
} from '../dtos/response/validate-jwt-response';

import { CommonNotificationMapperResponse } from 'src/tender-commons/dto/common-notification-mapper-response.dto';
import moment from 'moment';
import { TenderNotificationService } from 'src/tender-notification/services/tender-notification.service';
import { RoleEnum } from 'src/user/enums/role-enum';

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

  constructor(
    private configService: ConfigService,
    private readonly notificationService: TenderNotificationService,
  ) {
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

      return result;
    } catch (error) {
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
        loginId,
      },
      url: verifyEmailUrl,
    };

    try {
      const data = await axios(options);
      return data.data.code;
    } catch (error) {
      if (error.response.status < 500) {
        return error.response.status;
      }
      console.log('error', error.response.status);
      this.logger.error("Can't start verify email!", error.response.status);
      return 500;
    }
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
    } catch (error) {
      if (
        error.response.data &&
        error.response.data.fieldErrors &&
        error.response.status < 500
      ) {
        this.logger.error('FusionAuth Error:', error.response.data);
        throw new BadRequestException(
          `Field error (${[
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

  async fusionAuthTenderRegisterUser(
    registerRequest: TenderCreateUserFusionAuthDto,
  ) {
    const baseUrl = this.fusionAuthUrl;
    const registerUrl = baseUrl + '/api/user/registration/';

    let role: string[] = ['tender_client'];

    // change the tender app role to fusion auth roles
    if (registerRequest.user_roles) {
      const tmpRoles: string[] = registerRequest.user_roles.map(
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
          `Field error (${[
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

  async requestVerify(requestVerifyPayload: IVerifyEmailDto) {
    const baseUrl = this.fusionAuthUrl;
    const verifyUrl = baseUrl + '/api/user/verify-email';

    const queryVerify: IQueryAxiosVerify = {
      applicationId: this.fusionAuthAppId,
      email: requestVerifyPayload.email,
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
        const notifPayload: CommonNotificationMapperResponse = {
          logTime: moment(new Date().getTime()).format('llll'),
          generalHostEmail: 'tmra',
          clientSubject:
            requestVerifyPayload.organizationId &&
            requestVerifyPayload.organizationId === '62414373cf00cca3a830814a'
              ? 'Welcome to Giving Sadaqah'
              : 'Welcome to TMRA',
          clientId: [],
          clientEmail: [requestVerifyPayload.email],
          clientMobileNumber: [],
          clientEmailTemplatePath:
            requestVerifyPayload.organizationId &&
            requestVerifyPayload.organizationId === '62414373cf00cca3a830814a'
              ? 'gs/en/register/request_verify'
              : 'tmra/en/register/request_verify_tmra',
          clientEmailTemplateContext: [
            {
              donor_email: requestVerifyPayload.email,
              donor_name: requestVerifyPayload.fullName,
              donor_redirect_link: `${requestVerifyPayload.domainUrl}/verif/${data.verificationId}`,
            },
          ],
          clientContent: `We're excited to welcome you to ${
            requestVerifyPayload.organizationId &&
            requestVerifyPayload.organizationId === '62414373cf00cca3a830814a'
              ? 'Giving Sadaqah'
              : 'TMRA'
          } and we're even more excited about what we've got planned.`,
          reviewerId: [],
          ...(requestVerifyPayload.role === RoleEnum.DONOR && {
            reviewerEmail: [requestVerifyPayload.organizationEmail!],
            reviewerContent: 'There is a new donor that you should check!',
            reviewerMobileNumber: [],
            reviwerSubject:
              'Donor has sent you an Email! Please check your inbox...`',
            reviewerEmailTemplatePath:
              requestVerifyPayload.organizationId &&
              requestVerifyPayload.organizationId === '62414373cf00cca3a830814a'
                ? 'gs/en/register/new_donor_organization'
                : 'tmra/en/register/new_donor_organization_tmra',
            reviewerEmailTemplateContext: [
              {
                donor_email: requestVerifyPayload.email,
                donor_name: requestVerifyPayload.fullName,
              },
            ],
          }),
          createManyWebNotifPayload: [],
        };

        await this.notificationService.sendSmsAndEmailBatch(notifPayload);

        return data.verificationId;
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
