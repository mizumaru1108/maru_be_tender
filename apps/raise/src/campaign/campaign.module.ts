import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignVendorLog,
  CampaignVendorLogSchema,
  Vendor,
  VendorSchema,
} from '../buying/vendor/vendor.schema';
import { DonorModule } from '../donor/donor.module';
import {
  DonationLog,
  DonationLogSchema,
} from '../donation/schema/donation-log.schema';

import { Donor, DonorSchema } from '../donor/schema/donor.schema';
import { Volunteer, VolunteerSchema } from '../donor/schema/volunteer.schema';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { CampaignController } from './controllers/campaign.controller';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { CampaignService } from './services/campaign.service';
import { Anonymous, AnonymousSchema } from '../donor/schema/anonymous.schema';
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
        name: Operator.name,
        schema: OperatorSchema,
      },
      {
        name: CampaignVendorLog.name,
        schema: CampaignVendorLogSchema,
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
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    DonorModule,
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
