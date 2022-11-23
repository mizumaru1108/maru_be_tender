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
  private refreshToken: string | undefined = undefined;

  constructor(private readonly configService: ConfigService) {}

  async authorize(authCode?: string) {
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
      console.log('oauth2Client', oauth2Client);

      if (authCode) {
        await getRefreshToken(authCode); // exchange authCode to refreshToken
        // assign the assigned oauth2client with setted creds to this.oauth2Client
        // this.oauth2Client = oauth2Client;
        // return 'authorized';
        return oauth2Client;
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
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });

        console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
        return url;
      }

      async function getRefreshToken(authCode: string) {
        const token = await oauth2Client.getToken(authCode);
        // set token to the OAuth2 client to use it in later calls
        oauth2Client.setCredentials(token.tokens);
      }
    }
  }

  async makeOAuth2Client(clientId: string, clientSecret: string) {
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/tender-appointment/google-callback',
    );
  }

  async createEvent(
    client: OAuth2Client,
    summary: string,
    description: string,
    start: string,
    end: string,
    timeZone: string,
    attendees: string[],
  ) {
    const calendar = google.calendar({
      version: 'v3',
      auth: client,
    });
    const event: Schema$Event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone,
      },
      end: {
        dateTime: end,
        timeZone,
      },
      attendees: [
        {
          email: attendees[0],
          self: true,
        },
        {
          email: attendees[1],
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: nanoid(10),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    try {
      console.log('event', event);
      const result = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
