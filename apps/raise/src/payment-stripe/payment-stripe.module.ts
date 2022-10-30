import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';

import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import {
  Notifications,
  NotificationsSchema,
} from 'src/organization/schema/notifications.schema';
import {
  NotificationSettings,
  NotificationSettingsSchema,
} from 'src/organization/schema/notification_settings.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../donation/schema/donation_log.schema';
import {
  DonationLog,
  DonationLogSchema,
} from '../donation/schema/donation-log.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from '../donation/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from '../donation/schema/paymentGateway.schema';
import {
  ZakatLog,
  ZakatLogSchema,
} from '../zakat/schemas/zakat_log.schema';
import { Anonymous, AnonymousSchema } from '../donor/schema/anonymous.schema';
import { PaymentStripeController } from './payment-stripe.controller';
import { PaymentStripeService } from './payment-stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Anonymous.name,
        schema: AnonymousSchema,
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
        name: PaymentData.name,
        schema: PaymentDataSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
      { name: User.name, 
        schema: UserSchema 
      },
      { name: ZakatLog.name, 
        schema: ZakatLogSchema
      },
    ]),
  ],
  controllers: [PaymentStripeController],
  providers: [PaymentStripeService],
  exports: [PaymentStripeService],
})
export class PaymentStripeModule {}
