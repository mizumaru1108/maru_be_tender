import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GaxiosResponse } from 'gaxios';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import { nanoid } from 'nanoid';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;

// REF: https://blog.johnnyreilly.com/2021/09/10/google-apis-authentication-with-typescript
@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private gCalendar: Calendar;
  private oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get('gapiConfig.clientId') as string, // will use tender gapi config
      this.configService.get('gapiConfig.clientSecret') as string, // will use tender gapi config
      this.configService.get('tenderAppConfig.baseUrl') as string,
    );

    this.gCalendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async createEvent(
    creds: Credentials,
    googleCalendarPrefixUrl: string,
    summary: string,
    description: string,
    start: string,
    end: string,
    timeZone: string,
    attendees: string[],
  ) {
    const callbackGoogleEndpoint =
      (this.configService.get('tenderAppConfig.baseUrl') as string) +
      googleCalendarPrefixUrl;

    // console.log({ callbackGoogleEndpoint });

    this.oauth2Client = new OAuth2Client(
      this.configService.get('gapiConfig.clientId') as string, // will use tender gapi config
      this.configService.get('gapiConfig.clientSecret') as string, // will use tender gapi config
      callbackGoogleEndpoint,
    );

    // console.log(this.oauth2Client);

    this.oauth2Client.setCredentials(creds);
    this.gCalendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
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
      // the status of this meeting will be auto confirmed (user no longer needs to confirmed).
      status: 'confirmed',
      // no remainders
      reminders: {
        useDefault: false,
      },
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
      const result: GaxiosResponse<calendar_v3.Schema$Event> =
        await this.gCalendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
          conferenceDataVersion: 1,
        });
      return {
        calendarEventId: result.data.id,
        calendarLink: result.data.htmlLink,
        conferenceLink: result.data.hangoutLink,
      };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err);
    }
  }
}
