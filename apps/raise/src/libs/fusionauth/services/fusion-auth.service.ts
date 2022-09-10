import FusionAuthClient, {
  LoginResponse,
  RegistrationRequest as IFusionAuthRegistrationRequest,
  RegistrationResponse,
  User as IFusionAuthUser,
  UserRegistration as IFusionAuthUserRegistration,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { LoginRequestDto } from '../../../auth/dtos/login-request.dto';
import { RegisterRequestDto } from '../../../auth/dtos/register-request.dto';
import { baseEnvCallErrorMessage } from '../../../commons/helpers/base-env-call-error-message';

/**
 * Nest Fusion Auth Service
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class FusionAuthService {
  private fusionAuthClient: FusionAuthClient;
  private fusionAuthAdminClient: FusionAuthClient;
  private fusionAuthAppId: string;
  private fusionAuthUrl: string;
  private fusionAuthTenantId: string;
  private fusionAuthAdminKey: string;

  constructor(private configService: ConfigService) {
    const fusionAuthClientKey = this.configService.get<string>(
      'FUSIONAUTH_CLIENT_KEY',
    );
    if (!fusionAuthClientKey) {
      throw new InternalServerErrorException(
        `FUSIONAUTH_CLIENT_KEY ${baseEnvCallErrorMessage}`,
      );
    }

    const fusionAuthAdminKey = this.configService.get<string>(
      'FUSIONAUTH_ADMIN_KEY',
    );
    if (!fusionAuthAdminKey) {
      throw new InternalServerErrorException(
        `FUSIONAUTH_ADMIN_KEY ${baseEnvCallErrorMessage}`,
      );
    }
    this.fusionAuthAdminKey = fusionAuthAdminKey;

    const fusionAuthUrl = this.configService.get<string>('FUSIONAUTH_URL');
    if (!fusionAuthUrl) {
      throw new InternalServerErrorException(
        `FUSIONAUTH_URL ${baseEnvCallErrorMessage}`,
      );
    }
    this.fusionAuthUrl = fusionAuthUrl;

    const fusionAuthTenantId = this.configService.get<string>(
      'FUSIONAUTH_TENANT_ID',
    );
    if (!fusionAuthTenantId) {
      throw new InternalServerErrorException(
        `FUSIONAUTH_TENANT_ID ${baseEnvCallErrorMessage}`,
      );
    }
    this.fusionAuthTenantId = fusionAuthTenantId;

    const appId = this.configService.get<string>('FUSIONAUTH_APP_ID');
    console.log('application id (FUSIONAUTH_APP_ID):', appId);
    if (!appId) {
      throw new InternalServerErrorException(
        `FUSIONAUTH_APP_ID ${baseEnvCallErrorMessage}`,
      );
    }
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

  // async useFusionAuthClient() {
  //   return new FusionAuthClient(
  //     this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
  //     this.configService.get('FUSIONAUTH_URL', ''),
  //     this.configService.get('FUSIONAUTH_TENANT_ID', ''),
  //   );
  // }

  // async useFusionAuthAdminClient() {
  //   return new FusionAuthClient(
  //     this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
  //     this.configService.get('FUSIONAUTH_URL', ''),
  //     this.configService.get('FUSIONAUTH_TENANT_ID', ''),
  //   );
  // }

  async fusionAuthValidateToken(
    token: string,
  ): Promise<ClientResponse<ValidateResponse>> {
    return await this.fusionAuthClient.validateJWT(token);
  }

  async fusionAuthLogin(
    loginRequest: LoginRequestDto,
  ): Promise<ClientResponse<LoginResponse>> {
    loginRequest.applicationId = this.fusionAuthAppId;
    try {
      const result: ClientResponse<LoginResponse> =
        await this.fusionAuthClient.login(loginRequest);
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
   * spending much time, turns out i typo on FUSIONAUTH to FUSINAUTH, also have to
   * and have to add /api/user/registration
   * !NOT WORKING T_T, response 400
   * Ref: https://github.com/FusionAuth/fusionauth-typescript-client/issues/10
   * {"statusCode":400,"exception":{"fieldErrors":{"applicationId":[{"code":"[couldNotConvert]applicationId",
   * "message":"Invalid applicationId [user]. This must be a valid UUID String (e.g. 25a872da-bb44-4af8-a43d-e7bcb5351ebc)."}]
   * ,"userId":[{"code":"[couldNotConvert]userId","message":"Invalid userId [api]. This must be a valid UUID String
   * (e.g. 25a872da-bb44-4af8-a43d-e7bcb5351ebc)."}]}}}
   * !TODO: fix it when i have time
   */
  // async fusionAuthRegister(
  //   registerRequest: RegisterRequestDto,
  // ): Promise<ClientResponse<RegistrationResponse>> {
  //   // const fusionAuth = await this.useFusionAuthAdminClient();
  //   const baseUrl = this.configService.get<string>('FUSIONAUTH_URL', '');
  //   const registerUrl = baseUrl + '/api/user/registration';
  //   const fusionAuth = new FusionAuthClient(
  //     this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
  //     registerUrl,
  //     this.configService.get('FUSIONAUTH_TENANT_ID', ''),
  //   );
  //   const appId = this.configService.get<string>('FUSIONAUTH_APP_ID', '');
  //   const userId = uuidv4();
  //   console.log('appId', appId);
  //   console.log('userId', userId);
  //   const user: IFusionAuthUser = {
  //     email: registerRequest.email,
  //     password: registerRequest.password,
  //     firstName: registerRequest.firstName,
  //     lastName: registerRequest.lastName,
  //   };
  //   const registration: IFusionAuthUserRegistration = {
  //     applicationId: appId,
  //   };
  //   const registrationRequest: IFusionAuthRegistrationRequest = {
  //     user,
  //     registration,
  //   };
  //   console.log('masuk sini ko');
  //   console.log(registrationRequest);
  //   try {
  //     const response = await fusionAuth.register(userId, registrationRequest);
  //     return response;
  //   } catch (error: any) {
  //     console.log('eh error');
  //     console.log(error);
  //     console.log(JSON.stringify(error));
  //     throw new HttpException(error.message, error.statusCode);
  //   }
  // }

  /**
   * Fusion Auth Register
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
    console.log('application id(FUSIONAUTH_APP_ID)', this.fusionAuthAppId);
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
