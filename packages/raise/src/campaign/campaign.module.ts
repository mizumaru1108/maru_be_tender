import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { DonorService } from '../donor/donor.service';
import { Donor, DonorSchema } from '../donor/donor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
    ]),
  ],
  providers: [DonorService, CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
