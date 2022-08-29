import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './schema/donor.schema';
import { Volunteer, VolunteerSchema } from './schema/volunteer.schema';
// import { DonorController } from './donor.controller';
import {
  CampaignVendorLog,
  CampaignVendorLogSchema,
  Vendor,
  VendorSchema,
} from '../buying/vendor/vendor.schema';
import { Campaign, CampaignSchema } from '../campaign/campaign.schema';
import { DonorController } from './donor.controller';
import { Anonymous, AnonymousSchema } from './schema/anonymous.schema';
import { DonationLog, DonationLogSchema } from './schema/donation-log.schema';
import {
  DonationLogs,
  DonationLogSchema as DonationLogsSchema,
} from './schema/donation_log.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { Item, ItemSchema } from '../item/item.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from '../payment-stripe/schema/paymentData.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Anonymous.name,
        schema: AnonymousSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Volunteer.name,
        schema: VolunteerSchema,
      },
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
      {
        name: CampaignVendorLog.name,
        schema: CampaignVendorLogSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
      {
        name: Item.name,
        schema: ItemSchema,
      },
      {
        name: PaymentData.name,
        schema: PaymentDataSchema,
      },
    ]),
  ],
  providers: [DonorService],
  exports: [DonorService],
  controllers: [DonorController],
})
export class DonorModule {}
