import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import { nanoid } from 'nanoid';
import path from 'path';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;
// import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';

// REF: https://blog.johnnyreilly.com/2021/09/10/google-apis-authentication-with-typescript
@Injectable()
export class GoogleCalendarOAuthService {
  private readonly logger = new Logger(GoogleCalendarOAuthService.name);
  private gClendar: Calendar;
  private oauth2Client: OAuth2Client;
  private code: string | undefined = undefined;
  private refreshToken: string | undefined = undefined;

  constructor(private readonly configService: ConfigService) {}

  async getToken() {
    console.log('this.code', this.code);
    const clientId: string | undefined =
      this.configService.get('GAPI_CLIENT_ID');
    console.log('clientId', clientId);
    if (!clientId) this.logger.debug('GAPI_CLIENT_ID is not defined');

    const clientSecret: string | undefined =
      this.configService.get('GAPI_CLIENT_SECRET');
    console.log('clientSecret', clientSecret);
    if (!clientSecret) this.logger.debug('GAPI_CLIENT_SECRET is not defined');

    // this if is temporary solution before add .env on server (production)
    if (clientId && clientSecret) {
      const oauth2Client = await this.makeOAuth2Client({
        clientId: clientId!,
        clientSecret: clientSecret!,
      });

      if (this.code) await getRefreshToken(this.code);
      else getAuthUrl();

      async function getAuthUrl() {
        const url = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',

          // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
          scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });

        console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
      }

      async function getRefreshToken(code: string) {
        const token = await oauth2Client.getToken(code);
        console.log(token);
      }
    }
  }

  async makeOAuth2Client({
    clientId,
    clientSecret,
  }: {
    clientId: string;
    clientSecret: string;
  }) {
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/tender-appointment/google-callback',
    );
  }
}
