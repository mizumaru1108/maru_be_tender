import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
import path from 'path';
import { calendar_v3, google } from 'googleapis';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private SCOPE = ['https://www.googleapis.com/auth/calendar'];
  private gJwtClient;
  private gClendar: Calendar;
  private gAuth;
  private serviceAccountPath = path.join(
    __dirname,
    '../../../service-account.json',
  );

  constructor(private readonly configService: ConfigService) {
    const project_id = this.configService.get('GAPI_PROJECT_ID');
    if (!project_id) envLoadErrorHelper('GAPI_PROJECT_ID');

    const private_key_id = this.configService.get('GAPI_PRIVATE_KEY_ID');
    if (!private_key_id) envLoadErrorHelper('GAPI_PRIVATE_KEY_ID');

    const private_key = this.configService.get('GAPI_PRIVATE_KEY');
    if (!private_key) envLoadErrorHelper('GAPI_PRIVATE_KEY');

    const client_email = this.configService.get('GAPI_CLIENT_EMAIL');
    if (!client_email) envLoadErrorHelper('GAPI_CLIENT_EMAIL');

    const client_id = this.configService.get('GAPI_CLIENT_ID');
    if (!client_id) envLoadErrorHelper('GAPI_CLIENT_ID');

    const auth_uri = this.configService.get('GAPI_AUTH_URI');
    if (!auth_uri) envLoadErrorHelper('GAPI_AUTH_URI');

    const token_uri = this.configService.get('GAPI_TOKEN_URI');
    if (!token_uri) envLoadErrorHelper('GAPI_TOKEN_URI');

    const auth_provider_x509_cert_url = this.configService.get(
      'GAPI_AUTH_PROVIDER_X509_CERT_URL',
    );
    if (!auth_provider_x509_cert_url)
      envLoadErrorHelper('GAPI_AUTH_PROVIDER_X509_CERT_URL');

    const client_x509_cert_url = this.configService.get(
      'GAPI_CLIENT_X509_CERT_URL',
    );
    if (!client_x509_cert_url) envLoadErrorHelper('GAPI_CLIENT_X509_CERT_URL');

    const project_number = this.configService.get('GAPI_PROJECT_NUMBER');

    const tpmJwtClient = new google.auth.JWT(
      client_email,
      undefined,
      private_key,
      this.SCOPE,
    );
    this.gJwtClient = tpmJwtClient;

    const tpmClendar = google.calendar({
      version: 'v3',
      auth: tpmJwtClient,
    });
    this.gClendar = tpmClendar;

    const tmpAuth = new google.auth.GoogleAuth({
      keyFile: this.serviceAccountPath,
      scopes: this.SCOPE,
    });
    this.gAuth = tmpAuth;
  }

  async createEvent(
    summary: string,
    description: string,
    start: string,
    end: string,
    timeZone: string,
    attendees: string[],
  ) {
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
    };

    const result = calendar.events.insert(
      {
        auth,
        calendarId: 'primary',
        requestBody: event,
      },
      (err: any, res: any) => {
        if (err) {
          this.logger.error(err);
          return;
        }
        this.logger.log(res);
      },
    );
  }
}
