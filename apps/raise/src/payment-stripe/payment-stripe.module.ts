import { Module } from '@nestjs/common';
import { PaymentStripeService } from './payment-stripe.service';
import { PaymentStripeController } from './payment-stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from './schema/paymentGateway.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { Campaign, CampaignSchema } from 'src/campaign/campaign.schema';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { PaymentData, PaymentDataSchema } from './schema/paymentData.schema';
import { Anonymous, AnonymousSchema } from 'src/donor/schema/anonymous.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  Notifications,
  NotificationsSchema,
} from 'src/organization/schema/notifications.schema';
import {
  NotificationSettings,
  NotificationSettingsSchema,
} from 'src/organization/schema/notification_settings.schema';
import { EmailService } from 'src/libs/email/email.service';
import { EmailModule } from 'src/libs/email/email.module';

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
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
  ],
  providers: [PaymentStripeService],
  controllers: [PaymentStripeController],
})
export class PaymentStripeModule {}
