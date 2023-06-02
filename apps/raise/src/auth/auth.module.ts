import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OrganizationService } from 'src/organization/organization.service';

import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/donation/schema/paymentGateway.schema';
import {
  Appearance,
  AppearanceSchema,
} from '../organization/schema/appearance.schema';
import { Faq, FaqSchema } from '../organization/schema/faq.schema';
import {
  Notifications,
  NotificationsSchema,
} from '../organization/schema/notifications.schema';
import {
  NotificationSettings,
  NotificationSettingsSchema,
} from '../organization/schema/notification_settings.schema';
import {
  Organization,
  OrganizationSchema,
} from '../organization/schema/organization.schema';
import {
  AppearanceNavigation,
  AppearanceNavigationSchema,
} from '../organization/schema/nonprofit_appearance_navigation.schema';
import {
  AppearancePage,
  AppearancePageSchema,
} from '../organization/schema/nonprofit_appearance_page.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../donation/schema/donation_log.schema';
import {
  DonationLog,
  DonationLogSchema,
} from '../donation/schema/donation-log.schema';

//
import { ZakatLog, ZakatLogSchema } from '../zakat/schemas/zakat_log.schema';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '10000s' },
    }),
    OrganizationModule,
    MongooseModule.forFeature([
      {
        name: Appearance.name,
        schema: AppearanceSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Faq.name,
        schema: FaqSchema,
      },
      {
        name: Notifications.name,
        schema: NotificationsSchema,
      },
      {
        name: NotificationSettings.name,
        schema: NotificationSettingsSchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
      {
        name: AppearanceNavigation.name,
        schema: AppearanceNavigationSchema,
      },
      {
        name: AppearancePage.name,
        schema: AppearancePageSchema,
      },
      {
        name: ZakatLog.name,
        schema: ZakatLogSchema,
      },
    ]),
  ],
  providers: [AuthService, OrganizationService],
  controllers: [AuthController],
})
export class AuthModule {}
