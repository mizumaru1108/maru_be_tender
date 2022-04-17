import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AccountsModule } from './accounts/accounts.module';
import { ContactsModule } from './contacts/contacts.module';
import { CrmModule } from './crm/crm.module';
import { HrModule } from './hr/hr.module';
import { FundraisingGiftModule } from './fundraising-gift/fundraising-gift.module';
import { OrgsModule } from './orgs/orgs.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL')!,
      }),
      inject: [ConfigService],
    }),
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
    AccountsModule,
    ContactsModule,
    CrmModule,
    HrModule,
    FundraisingGiftModule,
    IntegrationsModule,
    OrgsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
