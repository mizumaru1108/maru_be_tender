import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private SCOPE = ['https://www.googleapis.com/auth/calendar'];
  private serviceAccount = path.join(
    __dirname,
    '../../../../../service-account.json',
  );
  // private jwtClient;
  // private clendar;
  // private auth;
  // private clendarEvent;

  constructor() {
    if (this.serviceAccount) {
      console.log(this.serviceAccount);
    }
  }
}
