import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { BuyingModule } from './buying/buying.module';
import { CampaignModule } from './campaign/campaign.module';
import { CommentsModule } from './comments/comments.module';
import { envLoadErrorHelper } from './commons/helpers/env-loaderror-helper';
import { ContactsModule } from './contacts/contacts.module';
import { CoreModule } from './core/core.module';
import { CrmModule } from './crm/crm.module';
import { DonationModule } from './donation/donation.module';
import { DonorModule } from './donor/donor.module';
import { FundraisingGiftModule } from './fundraising-gift/fundraising-gift.module';
import { FundraisingModule } from './fundraising/fundraising.module';
import { GeoModule } from './geo/geo.module';
import { GsAuthModule } from './gs-auth/gs-auth.module';
import { GsUserModule } from './gs-user/gs-user.module';
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
import { PermissionManagerModule } from './permission-manager/permission-manager.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { ProposalManagementModule } from './proposal-management/proposal.management.module';
import { ReferralModule } from './referral/referral.module';
import { SharedModule } from './shared/shared.module';
import { TenderAppointmentModule } from './tender-appointment/tender-appointment.module';
import { TenderAuthModule } from './tender-auth/tender-auth.module';
import { TenderEmailModule } from './tender-email/tender-email.module';
import { TenderTrackModule } from './tender-track/track.module';
import { TenderUserModule } from './tender-user/tender-user.module';
import { TenderModule } from './tender/tender.module';
import { TicketModule } from './ticket/ticket.module';
import { UsersModule } from './user/user.module';
import { WidgetBackendModule } from './widget-backend/widget-backend.module';
import { WidgetsModule } from './widgets/widgets.module';
import { ZakatModule } from './zakat/zakat.module';
/* Environment Config */
import { bunnyConfig } from './commons/configs/bunny-config';
import { fusionAuthConfig } from './commons/configs/fusion-auth-config';
import { nodeMailerConfig } from './commons/configs/nodemailer-config';
// import { metalApiConfig } from './commons/configs/metail-api-config';
// import { gapiConfig } from './commons/configs/gapi-config';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { LoggerModule } from 'nestjs-pino';
import { BankModule } from './bank/bank.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { gapiConfig } from './commons/configs/gapi-config';
import { mseGatConfig } from './commons/configs/msegat-config';
import { tenderAppConfig } from './commons/configs/tender-app-config';
import { twilioConfig } from './commons/configs/twilio-config';
import { NotificationManagementModule } from './notification-management/notification.management.module';
import { PaymentPaytabsModule } from './payment-paytabs/payment-paytabs.module';
import { QaHelperModule } from './qa-helper/qa-helper.module';
import { TenderCommentsModule } from './tender-comments/tender-comments.module';
import { TenderEventsModule } from './tender-events-gateway/tender-events.module';
import { TenderFileManagerModule } from './tender-file-manager/tender-file-manager.module';
import { TenderMessagesModule } from './tender-messaging/tender-messages.module';
import { TenderStatisticsModule } from './tender-statistics/tender-statistics.module';
import { BannerModule } from 'src/banners/banner.module';
import { HealthModule } from 'src/health/health.module';
import { discordConfig } from 'src/commons/configs/discord.config';

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

/**
 * Hendy's note: Exclude hostname & pid as they're useless in Kubernetes.
 * Reference: https://stackoverflow.com/a/68918229/122441
 */
const PINO_LOGGER_EXCLUDE_HOSTNAME_PID = { base: undefined };

@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     level: 'debug',
    //     transport:
    //       process.env.LOG_FORMAT === 'pretty'
    //         ? {
    //             target: 'pino-pretty',
    //             options: {
    //               // options for pino-pretty here
    //               colorize: true,
    //               levelFirst: true,
    //               translateTime: 'SYS:standard',
    //               ignore:
    //                 'req,res,responseTime,trace_id,span_id,trace_flags,dd',
    //             },
    //           }
    //         : undefined,
    //     formatters:
    //       process.env.LOG_FORMAT === 'pretty'
    //         ? {}
    //         : {
    //             level: (label) => {
    //               return {
    //                 level: label,
    //               };
    //             },
    //           },
    //   },
    // }),
    DatadogTraceModule.forRoot(),

    LoggerModule.forRoot({
      pinoHttp: {
        ...PINO_LOGGER_EXCLUDE_HOSTNAME_PID,
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          (process.env.NODE_ENV ?? 'development') === 'development' ||
          process.env.LOG_FORMAT === 'pretty'
            ? {
                target: 'pino-pretty',
                options: {
                  // options for pino-pretty here
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:standard',
                  ignore:
                    'req.id,req.headers,req.remoteAddress,req.remotePort,req.query,res,context,responseTime,trace_id,span_id,trace_flags,dd',
                  messageFormat: '{context}| {msg}',
                  singleLine: true,
                },
              }
            : undefined,
      },
      exclude: [
        { method: RequestMethod.GET, path: 'health/startup' },
        { method: RequestMethod.GET, path: 'health/liveness' },
        { method: RequestMethod.GET, path: 'health/readiness' },
      ],
    }),

    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      // load: [
      // metalApiConfig,
      // ],
      load: [
        fusionAuthConfig,
        bunnyConfig,
        nodeMailerConfig,
        gapiConfig,
        twilioConfig,
        tenderAppConfig,
        mseGatConfig,
        discordConfig,
      ],
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
    PrismaModule,
    GsAuthModule,
    GsUserModule,
    /* Tender */
    BeneficiaryModule,
    TenderModule,
    ProposalManagementModule,
    TenderAppointmentModule,
    TenderAuthModule,
    TenderUserModule,
    TenderEmailModule,
    TenderTrackModule,
    TenderCommentsModule,
    TenderMessagesModule,
    TenderStatisticsModule,
    TenderEventsModule,
    NotificationManagementModule,
    TenderFileManagerModule,
    PaymentPaytabsModule,
    BankModule,
    QaHelperModule,
    BannerModule,
    HealthModule,
  ],
  controllers: [],
})
export class AppModule {}
