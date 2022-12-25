import { Module } from '@nestjs/common';
import { AuthzedModule } from '../libs/authzed/authzed.module';
import { BunnyModule } from '../libs/bunny/bunny.module';
import { EmailModule } from '../libs/email/email.module';
import { FusionAuthModule } from '../libs/fusionauth/fusion-auth.module';
import { PaytabsModule } from '../libs/paytabs/paytabs.module';
import { StripeModule } from '../libs/stripe/stripe.module';
import { GoogleCalendarModule } from '../libs/google-calendar/google-calendar.module';
import { GoogleOAuth2Module } from '../libs/google-oauth2/google-oauth2.module';
// import { EventsModule } from '../tender-events-gateway/tender-events.module';

@Module({
  imports: [
    FusionAuthModule,
    BunnyModule,
    AuthzedModule,
    EmailModule,
    PaytabsModule,
    StripeModule,
    GoogleCalendarModule,
    GoogleOAuth2Module,
    // EventsModule, // socket io for real time events (tender)
  ],
})
export class SharedModule {}
