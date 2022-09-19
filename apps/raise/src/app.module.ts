import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { BuyingModule } from './buying/buying.module';
import { CampaignModule } from './campaign/campaign.module';
import { ContactsModule } from './contacts/contacts.module';
import { CoreModule } from './core/core.module';
import { CrmModule } from './crm/crm.module';
import { DonorModule } from './donor/donor.module';
import { FundraisingGiftModule } from './fundraising-gift/fundraising-gift.module';
import { FundraisingModule } from './fundraising/fundraising.module';
import { GeoModule } from './geo/geo.module';
import { HrModule } from './hr/hr.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { ItemModule } from './item/item.module';
import { ManagerModule } from './manager/manager.module';
import { OperatorModule } from './operator/operator.module';
import { OrganizationModule } from './organization/organization.module';
import { PaymentAmazonpsModule } from './payment-amazonps/payment-amazonps.module';
import { PaymentHyperpayModule } from './payment-hyperpay/payment-hyperpay.module';
import { PaymentPaypalModule } from './payment-paypal/payment-paypal.module';
import { PaymentStripeModule } from './payment-stripe/payment-stripe.module';
import { PaymentXenditModule } from './payment-xendit/payment-xendit.module';
import { ProjectModule } from './project/project.module';
import { ReferralModule } from './referral/referral.module';
import { SharedModule } from './shared/shared.module';
import { TicketModule } from './ticket/ticket.module';
import { UsersModule } from './user/user.module';
import { WidgetsModule } from './widgets/widgets.module';
import { ZakatModule } from './zakat/zakat.module';
// import { OpenTelemetryModule } from 'nestjs-otel';
// import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { CommentsModule } from './comments/comments.module';
import { envLoadErrorHelper } from './commons/helpers/env-loaderror-helper';
import { PermissionManagerModule } from './permission-manager/permission-manager.module';
import { WidgetBackendModule } from './widget-backend/widget-backend.module';
import { DonationModule } from './donation/donation.module';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGODB_URL')!;
        if (!mongoUrl) envLoadErrorHelper('MONGODB_URL');

        return {
          uri: mongoUrl,
          loggerLevel: 'debug',
        };
      },
      inject: [ConfigService],
    }),
    CoreModule,
    FundraisingModule,
    PaymentXenditModule,
    PaymentPaypalModule,
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
    CommentsModule,
    PermissionManagerModule,
    DonationModule,
  ],
  controllers: [],
})
export class AppModule {}
