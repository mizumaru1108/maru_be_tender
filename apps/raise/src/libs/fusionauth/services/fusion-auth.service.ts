import FusionAuthClient, {
  LoginResponse,
  RegistrationRequest as IFusionAuthRegistrationRequest,
  RegistrationResponse,
  User as IFusionAuthUser,
  UserRegistration as IFusionAuthUserRegistration,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { LoginRequestDto } from '../../../auth/dtos/login-request.dto';
import { RegisterRequestDto } from '../../../auth/dtos/register-request.dto';

/**
 * Nest Fusion Auth Service
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class FusionAuthService {
  constructor(private configService: ConfigService) {}

  async useFusionAuthClient() {
    return new FusionAuthClient(
      this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
  }

  async useFusionAuthAdminClient() {
    return new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
  }

  async fusionAuthLogin(
    loginRequest: LoginRequestDto,
  ): Promise<ClientResponse<LoginResponse>> {
    loginRequest.applicationId = this.configService.get<string>(
      'FUSIONAUTH_APP_ID',
      '',
    );
    try {
      const fusionauth = await this.useFusionAuthClient();
      const result: ClientResponse<LoginResponse> = await fusionauth.login(
        loginRequest,
      );
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
   * !NOT WORKING T_T, idk why, response 400
   * {"statusCode":400,"exception":{"fieldErrors":{"applicationId":[{"code":"[couldNotConvert]applicationId",
   * "message":"Invalid applicationId [user]. This must be a valid UUID String (e.g. 25a872da-bb44-4af8-a43d-e7bcb5351ebc)."}]
   * ,"userId":[{"code":"[couldNotConvert]userId","message":"Invalid userId [api]. This must be a valid UUID String
   * (e.g. 25a872da-bb44-4af8-a43d-e7bcb5351ebc)."}]}}}
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
   * Works fine with post T_T
   */
  async fusionAuthRegister(
    registerRequest: RegisterRequestDto,
  ): Promise<ClientResponse<RegistrationResponse>> {
    const baseUrl = this.configService.get<string>('FUSIONAUTH_URL', '');
    const registerUrl = baseUrl + '/api/user/registration/';
    const user: IFusionAuthUser = {
      email: registerRequest.email,
      password: registerRequest.password,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
    };
    const registration: IFusionAuthUserRegistration = {
      applicationId: this.configService.get<string>('FUSIONAUTH_APP_ID', ''),
    };
    const registrationRequest: IFusionAuthRegistrationRequest = {
      user,
      registration,
    };

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.configService.get<string>(
          'FUSIONAUTH_ADMIN_KEY',
          '',
        ),
        'X-FusionAuth-TenantId': this.configService.get<string>(
          'FUSIONAUTH_TENANT_ID',
          '',
        ),
      },
      data: registrationRequest,
      url: registerUrl,
    };

    try {
      const data = await axios(options);
      return data.data as ClientResponse<RegistrationResponse>;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
