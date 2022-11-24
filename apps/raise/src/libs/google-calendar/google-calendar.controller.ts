import { Controller } from '@nestjs/common';
import { GoogleCalendarOAuthService } from './google-calendar-oauth.service';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(
    private readonly googleCalendarOAuthService: GoogleCalendarOAuthService,
  ) {}
}
