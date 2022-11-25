import FusionAuthClient, {
  LoginResponse,
  RegistrationRequest as IFusionAuthRegistrationRequest,
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
import { rootLogger } from 'src/logger';
import { LoginRequestDto } from '../../../auth/dtos/login-request.dto';
import { RegisterRequestDto } from '../../../auth/dtos/register-request.dto';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import {
  appRoleToFusionAuthRoles,
  TenderAppRole,
} from '../../../tender-commons/types';
import { TenderCreateUserDto } from '../../../tender-user/user/dtos/requests/create-user.dto';

/**
 * Nest Fusion Auth Service
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class FusionAuthService {
  private logger = rootLogger.child({ logger: FusionAuthService.name });
  private fusionAuthClient: FusionAuthClient;
  private fusionAuthAdminClient: FusionAuthClient;
  private fusionAuthAppId: string;
  private fusionAuthUrl: string;
  private fusionAuthTenantId: string;
  private fusionAuthAdminKey: string;
  constructor(private configService: ConfigService) {
    const fusionAuthClientKey = this.configService.get<string>(
      'FUSIONAUTH_CLIENT_KEY',
    )!;
    if (!fusionAuthClientKey) envLoadErrorHelper('FUSIONAUTH_CLIENT_KEY');

    const fusionAuthAdminKey = this.configService.get<string>(
      'FUSIONAUTH_ADMIN_KEY',
    )!;
    if (!fusionAuthAdminKey) envLoadErrorHelper('FUSIONAUTH_ADMIN_KEY');
    this.fusionAuthAdminKey = fusionAuthAdminKey;

    const fusionAuthUrl = this.configService.get<string>('FUSIONAUTH_URL')!;
    if (!fusionAuthUrl) envLoadErrorHelper('FUSIONAUTH_URL');
    this.fusionAuthUrl = fusionAuthUrl;

    const fusionAuthTenantId = this.configService.get<string>(
      'FUSIONAUTH_TENANT_ID',
    )!;
    if (!fusionAuthTenantId) envLoadErrorHelper('FUSIONAUTH_TENANT_ID');
    this.fusionAuthTenantId = fusionAuthTenantId;

    const appId = this.configService.get<string>('FUSIONAUTH_APP_ID')!;
    if (!appId) envLoadErrorHelper('FUSIONAUTH_APP_ID');
    this.fusionAuthAppId = appId;

    this.fusionAuthClient = new FusionAuthClient(
      fusionAuthClientKey,
      fusionAuthUrl,
      fusionAuthTenantId,
    );

    this.fusionAuthAdminClient = new FusionAuthClient(
      fusionAuthAdminKey,
      fusionAuthUrl,
      fusionAuthTenantId,
    );
  }

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
    } catch (error) {
      console.log(error);
      if (error.statusCode === 404) {
        throw new BadRequestException('User not found!');
      } else {
        throw new InternalServerErrorException(
          'Something went wrong when deleting user from server!',
        );
      }
    }
  }

  async fusionAuthTenderRegisterUser(registerRequest: TenderCreateUserDto) {
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
      mobilePhone: registerRequest.mobile_number,
    };

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

    try {
      const data = await axios(options);
      return data.data;
    } catch (error) {
      this.logger.debug('Error', error);
      if (error.response.status < 500) {
        console.log(error.response.data);
        throw new BadRequestException(
          `Registration Failed, either user is exist or something else!, more details: ${
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
}
