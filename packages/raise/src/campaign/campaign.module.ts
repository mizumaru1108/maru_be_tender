import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { DonorService } from '../donor/donor.service';
import { Donor, DonorSchema } from '../donor/schema/donor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';
import {
  DonationLog,
  DonationLogSchema,
} from '../donor/schema/donation-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
    ]),
  ],
  providers: [DonorService, CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
