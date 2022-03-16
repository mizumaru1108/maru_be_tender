import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { EmailModule } from './email/email.module';
import { FundraisingModule } from './fundraising/fundraising.module';
import { GeoModule } from './geo/geo.module';
import { PaymentAmazonpsModule } from './payment-amazonps/payment-amazonps.module';
import { PaymentHyperpayModule } from './payment-hyperpay/payment-hyperpay.module';
import { PaymentPaypalModule } from './payment-paypal/payment-paypal.module';
import { PaymentPaytabsModule } from './payment-paytabs/payment-paytabs.module';
import { PaymentStripeModule } from './payment-stripe/payment-stripe.module';
import { PaymentXenditModule } from './payment-xendit/payment-xendit.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    EmailModule,
    FundraisingModule,
    PaymentXenditModule,
    PaymentPaypalModule,
    PaymentPaytabsModule,
    PaymentAmazonpsModule,
    PaymentStripeModule,
    PaymentHyperpayModule,
    GeoModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
