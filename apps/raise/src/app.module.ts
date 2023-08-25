import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './core/core.module';
import { CrmModule } from './crm/crm.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProposalManagementModule } from './proposal-management/proposal.management.module';
import { SharedModule } from './shared/shared.module';
import { TenderAppointmentModule } from './tender-appointment/tender-appointment.module';
import { TenderAuthModule } from './tender-auth/tender-auth.module';
import { TenderTrackModule } from './tender-track/track.module';
import { TenderModule } from './tender/tender.module';
/* Environment Config */
import { bunnyConfig } from './commons/configs/bunny-config';
import { fusionAuthConfig } from './commons/configs/fusion-auth-config';
import { nodeMailerConfig } from './commons/configs/nodemailer-config';
// import { metalApiConfig } from './commons/configs/metail-api-config';
// import { gapiConfig } from './commons/configs/gapi-config';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { LoggerModule } from 'nestjs-pino';
import { BannerModule } from 'src/banners/banner.module';
import { discordConfig } from 'src/commons/configs/discord.config';
import { HealthModule } from 'src/health/health.module';
import { AuthorityManagementModule } from './authority-management/authority.management.module';
import { BankModule } from './bank/bank.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { gapiConfig } from './commons/configs/gapi-config';
import { mseGatConfig } from './commons/configs/msegat-config';
import { tenderAppConfig } from './commons/configs/tender-app-config';
import { twilioConfig } from './commons/configs/twilio-config';
import { ContactUsModule } from './contact-us/contact.us.module';
import { NotificationManagementModule } from './notification-management/notification.management.module';
import { QaHelperModule } from './qa-helper/qa-helper.module';
import { SmsConfigModule } from './sms-config/sms.config.module';
import { TenderCommentsModule } from './tender-comments/tender-comments.module';
import { TenderEventsModule } from './tender-events-gateway/tender-events.module';
import { TenderFileManagerModule } from './tender-file-manager/tender-file-manager.module';
import { TenderMessagesModule } from './tender-messaging/tender-messages.module';
import { TenderStatisticsModule } from './tender-statistics/tender-statistics.module';
import { UserManagementModule } from './tender-user/user.management.module';
import { RegionManagementModule } from './region-management/region.management.module';

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
    CoreModule,
    CrmModule,
    SharedModule,
    PrismaModule,
    /* Tender */
    BeneficiaryModule,
    TenderModule,
    ProposalManagementModule,
    TenderAppointmentModule,
    TenderAuthModule,
    TenderTrackModule,
    TenderCommentsModule,
    TenderMessagesModule,
    TenderStatisticsModule,
    TenderEventsModule,
    NotificationManagementModule,
    TenderFileManagerModule,
    BankModule,
    QaHelperModule,
    BannerModule,
    HealthModule,
    AuthorityManagementModule,
    ContactUsModule,
    SmsConfigModule,
    UserManagementModule,
    RegionManagementModule,
  ],
  controllers: [],
})
export class AppModule {}
