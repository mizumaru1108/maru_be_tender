import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { DonorService } from '../donor/donor.service';
import { Donor, DonorSchema } from '../donor/schema/donor.schema';
import { Volunteer, VolunteerSchema } from '../donor/schema/volunteer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { Vendor, VendorSchema } from './vendor.schema';
import { CampaignService } from './campaign.service';
import {
  DonationLog,
  DonationLogSchema,
} from '../donor/schema/donation-log.schema';
import {
  DonationLogs,
  DonationLogSchema as DonationLogsSchema,
} from '../donor/schema/donation_log.schema';
import { Anonymous, AnonymousSchema } from 'src/donor/schema/anonymous.schema';
import {
  Operator,
  OperatorSchema,
} from '../operator/schema/operator.schema';

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
        name: Operator.name,
        schema: OperatorSchema,
      },
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
      {
        name: Volunteer.name,
        schema: VolunteerSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
    ]),
  ],
  providers: [DonorService, CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
