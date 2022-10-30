import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/donation/schema/paymentGateway.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Appearance, AppearanceSchema } from './schema/appearance.schema';
import { Faq, FaqSchema } from './schema/faq.schema';
import {
  Notifications,
  NotificationsSchema,
} from './schema/notifications.schema';
import {
  NotificationSettings,
  NotificationSettingsSchema,
} from './schema/notification_settings.schema';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import {
  AppearanceNavigation,
  AppearanceNavigationSchema,
} from './schema/nonprofit_appearance_navigation.schema';
import {
  AppearancePage,
  AppearancePageSchema,
} from './schema/nonprofit_appearance_page.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../donation/schema/donation_log.schema';
import {
  DonationLog,
  DonationLogSchema,
} from '../donation/schema/donation-log.schema';

@Module({
  imports: [
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
    ]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
