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
import { OrganizationModule } from './organization/organization.module';
import { ReferralModule } from './referral/referral.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DonorModule } from './donor/donor.module';
import { CampaignModule } from './campaign/campaign.module';
import { TicketModule } from './ticket/ticket.module';
import { ZakatModule } from './zakat/zakat.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthzedService } from './authzed/authzed.service';
import { AuthzedModule } from './authzed/authzed.module';
import { BuyingModule } from './buying/buying.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadModule } from './upload/upload.module';
import { OperatorModule } from './operator/operator.module';
import { ManagerModule } from './manager/manager.module';
import { WidgetsModule } from './widgets/widgets.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        loggerLevel: 'debug',
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
    OrganizationModule,
    ReferralModule,
    DonorModule,
    ManagerModule,
    CampaignModule,
    OperatorModule,
    TicketModule,
    ZakatModule,
    UsersModule,
    AuthModule,
    AuthzedModule,
    BuyingModule,
    UploadModule,
    WidgetsModule,
  ],
  controllers: [],
  providers: [AuthzedService],
})
export class AppModule {}
