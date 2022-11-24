import { Module, Global } from '@nestjs/common';
import { GoogleCalendarOAuthService } from './google-calendar-oauth.service';
import { GoogleCalendarServiceAccountService } from './google-calendar-service-account.service';

import { GoogleCalendarController } from './google-calendar.controller';
@Global()
@Module({
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarServiceAccountService, GoogleCalendarOAuthService],
  exports: [GoogleCalendarServiceAccountService, GoogleCalendarOAuthService],
})
export class GoogleCalendarModule {}
