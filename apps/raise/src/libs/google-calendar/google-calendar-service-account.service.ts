import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
import { calendar_v3, google } from 'googleapis';
import { nanoid } from 'nanoid';
import path from 'path';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;

@Injectable()
export class GoogleCalendarServiceAccountService {
  private readonly logger = new Logger(
    GoogleCalendarServiceAccountService.name,
  );
  private SCOPE = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  private gJwtClient;
  private gClendar: Calendar;
  private gAuth;
  private serviceAccountPath = path.join(
    __dirname,
    '../../../service-account.json',
  );

  constructor(private readonly configService: ConfigService) {
    const project_id = this.configService.get('GAPI_PROJECT_ID');
    const private_key_id = this.configService.get('GAPI_PRIVATE_KEY_ID');
    const private_key = this.configService.get('GAPI_PRIVATE_KEY');
    const client_email = this.configService.get('GAPI_CLIENT_EMAIL');
    const client_id = this.configService.get('GAPI_CLIENT_ID');
    const auth_uri = this.configService.get('GAPI_AUTH_URI');
    const token_uri = this.configService.get('GAPI_TOKEN_URI');
    const auth_provider_x509_cert_url = this.configService.get(
      'GAPI_AUTH_PROVIDER_X509_CERT_URL',
    );
    // const client_x509_cert_url = this.configService.get(
    //   'GAPI_CLIENT_X509_CERT_URL',
    // );
    // const project_number = this.configService.get('GAPI_PROJECT_NUMBER');

    if (client_email && private_key) {
      const tpmJwtClient = new google.auth.JWT(
        client_email,
        undefined,
        private_key,
        this.SCOPE,
      );
      this.gJwtClient = tpmJwtClient;
    }

    if (this.gJwtClient) {
      const tpmClendar = google.calendar({
        version: 'v3',
        auth: this.gJwtClient,
      });
      this.gClendar = tpmClendar;
    }

    if (this.serviceAccountPath) {
      const tmpAuth = new google.auth.GoogleAuth({
        keyFile: this.serviceAccountPath,
        scopes: this.SCOPE,
      });
      this.gAuth = tmpAuth;
    }
  }

  async getToken() {
    if (this.gAuth) {
      const auth = this.gAuth;
      const token = await auth.getClient();
      console.log(token);
    }
  }

  async createEvent(
    summary: string,
    description: string,
    start: string,
    end: string,
    timeZone: string,
    attendees: string[],
  ) {
    if (this.gClendar && this.gAuth) {
      const calendar = this.gClendar;
      const auth = this.gAuth;

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
        // attendees: [
        //   {
        //     email: attendees[0],
        //   },
        //   {
        //     email: attendees[1],
        //   },
        // ],
        // conferenceData: {
        //   createRequest: {
        //     requestId: nanoid(),
        //     conferenceSolutionKey: {
        //       type: 'hangoutsMeet',
        //     },
        //   },
        // },
      };

      try {
        console.log('event', event);
        const result = await calendar.events.insert({
          auth,
          calendarId: 'primary',
          requestBody: event,
          // conferenceDataVersion: 1,
        });
        console.log(result);
        return result;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
