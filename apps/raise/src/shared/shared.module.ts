import { Module } from '@nestjs/common';
import { AuthzedModule } from '../libs/authzed/authzed.module';
import { BunnyModule } from '../libs/bunny/bunny.module';
import { EmailModule } from '../libs/email/email.module';
import { FusionAuthModule } from '../libs/fusionauth/fusion-auth.module';
import { GoogleCalendarModule } from '../libs/google-calendar/google-calendar.module';
import { GoogleOAuth2Module } from '../libs/google-oauth2/google-oauth2.module';
import { TwilioModule } from '../libs/twilio/twilio.module';
import { MsegatModule } from '../libs/msegat/msegat.module';
import { DiscordModule } from 'src/libs/discord/discord.module';

@Module({
  imports: [
    FusionAuthModule,
    BunnyModule,
    AuthzedModule,
    EmailModule,
    GoogleCalendarModule,
    GoogleOAuth2Module,
    TwilioModule,
    MsegatModule,
    DiscordModule,
    // EventsModule, // socket io for real time events (tender)
  ],
})
export class SharedModule {}
