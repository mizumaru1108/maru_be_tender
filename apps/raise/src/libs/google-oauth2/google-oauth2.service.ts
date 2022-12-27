import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GaxiosError } from 'gaxios';
import { Credentials, OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuth2Service {
  private readonly logger = new Logger(GoogleOAuth2Service.name);
  private oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('GAPI_CLIENT_ID'),
      this.configService.get<string>('GAPI_CLIENT_SECRET'),
      'http://localhost:3000/tender-appointment/google-callback',
    );
  }

  async authorizeOld(authCode?: string) {
    const clientId: string | undefined =
      this.configService.get<string>('GAPI_CLIENT_ID');
    if (clientId) this.logger.debug('GAPI_CLIENT_ID FOUND!');
    if (!clientId) this.logger.debug('GAPI_CLIENT_ID is not defined');

    const clientSecret: string | undefined =
      this.configService.get<string>('GAPI_CLIENT_SECRET');
    if (clientSecret) this.logger.debug('GAPI_CLIENT_SECRET FOUND!');
    if (!clientSecret) this.logger.debug('GAPI_CLIENT_SECRET is not defined');

    // this if is temporary solution before add .env on server (production)
    if (clientId && clientSecret) {
      const oauth2Client = await this.makeOAuth2Client(
        clientId!,
        clientSecret!,
      );
      // console.log('oauth2Client', oauth2Client);

      // if code exist then exchange code to refresh token
      if (authCode) {
        await getRefreshToken(authCode); // exchange authCode to refreshToken
        return oauth2Client; // return oauth2Client that already have refresh token (logined google user)
      } else {
        const loginUrl = await getLoginUrl();
        return loginUrl;
      }

      async function getLoginUrl() {
        const url = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          prompt: 'consent',

          // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
          scope: [
            'profile', // get the user's profile
            'https://www.googleapis.com/auth/calendar', // get the user's calendar
            'https://www.googleapis.com/auth/calendar.events', // for calendar events (create)
          ],
          // login_hint: 'rdanang.dev@gmail.com',
        });

        console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
        // just imagine that FE will get this url and open in new tab, after it loggined it will be go to the callback
        // (localhost:3000/tender-appointment/google-callback) [GET]
        return url;
      }

      async function getRefreshToken(authCode: string) {
        const token = await oauth2Client.getToken(authCode);
        console.log('the code', authCode);
        console.log('after exchange the code, here is the token:', token);
        // set token to the OAuth2 client to use it in later calls
        oauth2Client.setCredentials(token.tokens);
      }
    }
  }

  async makeOAuth2Client(clientId: string, clientSecret: string) {
    return new OAuth2Client(
      clientId,
      clientSecret,
      'http://localhost:3000/tender-appointment/google-callback',
    );
  }

  async getLoginUrl() {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
      scope: [
        'profile', // get the user's profile
        'https://www.googleapis.com/auth/calendar', // get the user's calendar
        'https://www.googleapis.com/auth/calendar.events', // for calendar events (create)
      ],
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
