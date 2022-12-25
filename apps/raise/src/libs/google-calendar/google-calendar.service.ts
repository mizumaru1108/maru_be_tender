import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import { nanoid } from 'nanoid';
import { GaxiosResponse } from 'gaxios';
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
      this.configService.get<string>('GAPI_CLIENT_ID'),
      this.configService.get<string>('GAPI_CLIENT_SECRET'),
      'http://localhost:3000/tender-appointment/google-callback',
    );

    this.gCalendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async createEvent(
    creds: Credentials,
    summary: string,
    description: string,
    start: string,
    end: string,
    timeZone: string,
    attendees: string[],
  ) {
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
      // console.log('event', event);
      const result: GaxiosResponse<calendar_v3.Schema$Event> =
        await this.gCalendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
          conferenceDataVersion: 1,
        });
      console.log(result);
      return {
        calendarLink: result.data.htmlLink,
        conferenceLink: result.data.hangoutLink,
      };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err);
    }
  }
}
