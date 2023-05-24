import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPaytabsController } from './payment-paytabs.controller';
import { PaymentPaytabsService } from './payment-paytabs.service';

import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';

import {
  PaymentGateway,
  PaymentGatewaySchema,
} from '../donation/schema/paymentGateway.schema';

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

import { Campaign, CampaignSchema } from '../campaign/schema/campaign.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { ZakatLog, ZakatLogSchema } from '../zakat/schemas/zakat_log.schema';
import { Anonymous, AnonymousSchema } from '../donor/schema/anonymous.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      { name: User.name, schema: UserSchema },
      { name: ZakatLog.name, schema: ZakatLogSchema },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Anonymous.name,
        schema: AnonymousSchema,
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
        name: PaymentData.name,
        schema: PaymentDataSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
    ]),
  ],
  controllers: [PaymentPaytabsController],
  providers: [PaymentPaytabsService],
})
export class PaymentPaytabsModule {}
