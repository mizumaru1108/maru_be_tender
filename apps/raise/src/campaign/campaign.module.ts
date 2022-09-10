import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Anonymous, AnonymousSchema } from 'src/donor/schema/anonymous.schema';
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
} from '../donor/schema/donation-log.schema';
import {
  DonationLogs,
  DonationLogSchema as DonationLogsSchema,
} from '../donor/schema/donation_log.schema';
import { Donor, DonorSchema } from '../donor/schema/donor.schema';
import { Volunteer, VolunteerSchema } from '../donor/schema/volunteer.schema';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { CampaignController } from './campaign.controller';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { CampaignService } from './campaign.service';

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
