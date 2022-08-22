import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { FundraisingModule } from './fundraising/fundraising.module';
import { GeoModule } from './geo/geo.module';
import { PaymentAmazonpsModule } from './payment-amazonps/payment-amazonps.module';
import { PaymentHyperpayModule } from './payment-hyperpay/payment-hyperpay.module';
import { PaymentPaypalModule } from './payment-paypal/payment-paypal.module';
import { PaymentPaytabsModule } from './payment-paytabs/payment-paytabs.module';
import { PaymentStripeModule } from './payment-stripe/payment-stripe.module';
import { PaymentXenditModule } from './payment-xendit/payment-xendit.module';
import { ProjectModule } from './project/project.module';
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
import { ItemModule } from './item/item.module';
import { TicketModule } from './ticket/ticket.module';
import { ZakatModule } from './zakat/zakat.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BuyingModule } from './buying/buying.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OperatorModule } from './operator/operator.module';
import { ManagerModule } from './manager/manager.module';
import { WidgetsModule } from './widgets/widgets.module';
import { SharedModule } from './shared/shared.module';
// import { OpenTelemetryModule } from 'nestjs-otel';
// import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { WidgetBackendModule } from './widget-backend/widget-backend.module';

// const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
//   metrics: {
//     hostMetrics: false, // Includes Host Metrics
//     defaultMetrics: false, // Includes Default Metrics
//     apiMetrics: {
//       enable: false, // Includes api metrics
//       timeBuckets: [], // You can change the default time buckets
//       defaultAttributes: {
//         // You can set default labels for api metrics
//         // custom: 'label',
//       },
//       ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
//       ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
//     },
//   },
// });

@Module({
  imports: [
    // OpenTelemetryModuleConfig,
    // OpenTelemetryModule.forRoot({
    //   applicationName: 'tmra-raise',
    // }),
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
    FundraisingModule,
    PaymentXenditModule,
    PaymentPaypalModule,
    PaymentPaytabsModule,
    PaymentAmazonpsModule,
    PaymentStripeModule,
    PaymentHyperpayModule,
    GeoModule,
    ProjectModule,
    ItemModule,
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
    BuyingModule,
    WidgetsModule,
    SharedModule,
    WidgetBackendModule,
  ],
  controllers: [],
})
export class AppModule {}
