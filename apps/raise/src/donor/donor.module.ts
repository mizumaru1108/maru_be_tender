import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './schema/donor.schema';
import { Volunteer, VolunteerSchema } from './schema/volunteer.schema';

import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';

import {
  CampaignVendorLog,
  CampaignVendorLogSchema,
  Vendor,
  VendorSchema,
} from '../buying/vendor/vendor.schema';
import { Campaign, CampaignSchema } from '../campaign/schema/campaign.schema';
import { DonorController } from './donor.controller';
import {
  DonationLog,
  DonationLogSchema,
} from '../donation/schema/donation-log.schema';

import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/donation/schema/paymentGateway.schema';
import { Item, ItemSchema } from '../item/item.schema';

import { Project, ProjectSchema } from '../project/schema/project.schema';
import { Anonymous, AnonymousSchema } from './schema/anonymous.schema';
import {
  DonationDetail,
  DonationDetailSchema,
} from '../donation/schema/donation-detail.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from '../donation/schema/paymentData.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../donation/schema/donation_log.schema';

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
        name: Organization.name,
        schema: OrganizationSchema,
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
        name: DonationDetail.name,
        schema: DonationDetailSchema,
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
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
  ],
  providers: [DonorService],
  exports: [DonorService],
  controllers: [DonorController],
})
export class DonorModule {}
