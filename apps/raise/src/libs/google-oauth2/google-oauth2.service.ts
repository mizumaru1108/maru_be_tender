import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GaxiosError, GaxiosResponse } from 'gaxios';
import { Credentials, OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuth2Service {
  private readonly logger = new Logger(GoogleOAuth2Service.name);
  private oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('GAPI_CLIENT_ID'), // will use tender gapi config
      this.configService.get<string>('GAPI_CLIENT_SECRET'), // will use tender gapi config
      'http://localhost:3000/tender-appointment/google-callback',
    );
  }

  async useTmraGAuthConfig() {
    if (
      this.configService.get<string>('TMRA_GAPI_CLIENT_ID') !== undefined &&
      this.configService.get<string>('TMRA_GAPI_CLIENT_SECRET') !== undefined &&
      this.configService.get<string>('TMRA_GAPI_REDIRECT_URL') !== undefined
    ) {
      return (this.oauth2Client = new OAuth2Client(
        this.configService.get<string>('TMRA_GAPI_CLIENT_ID'),
        this.configService.get<string>('TMRA_GAPI_CLIENT_SECRET'),
        this.configService.get<string>('TMRA_GAPI_REDIRECT_URL'),
      ));
    } else {
      return (this.oauth2Client = new OAuth2Client(
        this.configService.get<string>('GAPI_CLIENT_ID'),
        this.configService.get<string>('GAPI_CLIENT_SECRET'),
        'http://localhost:3000/tender-appointment/google-callback',
      ));
    }
  }

  async tmraGetLoginUrl(scope: string[]): Promise<string> {
    await this.useTmraGAuthConfig();
    return await this.getLoginUrl(scope);
  }

  // // get user info from google (using credentials)
  // async getUserInfo(credentials: Credentials): Promise<any> {
  //   try {
  //     const userInfo = await this.oauth2Client.request({
  //       url: 'https://www.googleapis.com/oauth2/v1/userinfo',
  //       headers: {
  //         Authorization: `Bearer ${credentials.access_token}`,
  //       },
  //     });

  //     return userInfo.data;
  //   } catch (error) {
  //     if (error instanceof GaxiosError && error.response) {
  //       this.logger.error(error.response.data);
  //       throw new HttpException(error.response.data, error.response.status);
  //     }
  //     this.logger.error(error);
  //     throw new HttpException(error, 500);
  //   }
  // }

  // async getUserInfo(
  //   credentials: Credentials,
  // ): Promise<GaxiosResponse<UserInfo>> {
  //   try {
  //     const userInfo = await this.oauth2Client.request<UserInfo>({
  //       url: 'https://www.googleapis.com/oauth2/v1/userinfo',
  //       headers: {
  //         Authorization: `Bearer ${credentials.access_token}`,
  //       },
  //     });

  //     return userInfo;
  //   } catch (error) {
  //     if (error instanceof GaxiosError && error.response) {
  //       this.logger.error(error.response.data);
  //       throw new HttpException(error.response.data, error.response.status);
  //     }
  //     this.logger.error(error);
  //     throw new HttpException(error, 500);
  //   }
  // }

  async getLoginUrl(scope: string[]): Promise<string> {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
      scope,
      // login_hint: 'rdanang.dev@gmail.com',
    });
    // console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
    return url;
  }

  // get new refresh token (after user logined, exchange authCode to refreshToken)
  async getNewRefreshToken(authCode: string): Promise<Credentials> {
    try {
      const response = await this.oauth2Client.getToken(authCode); // exchange authCode to refreshToken
      if (!response.tokens) {
        throw new UnauthorizedException('access_token is not defined');
      }
      this.oauth2Client.setCredentials(response.tokens); // set the new credentials
      return response.tokens;
    } catch (error) {
      if (error instanceof GaxiosError) {
        if (
          error.code &&
          !isNaN(Number(error.code)) &&
          error.message &&
          Number(error.code) >= 400 &&
          Number(error.code) < 500
        ) {
          throw new HttpException(error.message, Number(error.code));
        } else {
          throw new HttpException(error.message, 500);
        }
      }
      throw new Error(error);
    }
  }

  // renew the refresh token (extend the token's lifetime)
  async renewRefreshToken(credentials: Credentials): Promise<Credentials> {
    try {
      this.oauth2Client.setCredentials(credentials); // use the old credentials
      const response = await this.oauth2Client.refreshAccessToken(); // renew the refresh token
      if (!response.credentials) {
        throw new UnauthorizedException('access_token is not defined');
      }
      this.oauth2Client.setCredentials(response.credentials); // set the new credentials
      return response.credentials;
    } catch (error) {
      if (error instanceof GaxiosError) {
        if (
          error.code &&
          !isNaN(Number(error.code)) &&
          error.message &&
          Number(error.code) >= 400 &&
          Number(error.code) < 500
        ) {
          throw new HttpException(error.message, Number(error.code));
        } else {
          throw new HttpException(error.message, 500);
        }
      }
      throw new Error(error);
    }
  }
}
