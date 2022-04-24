import { Module } from '@nestjs/common';
// import { OrgsService } from './orgs.service';
// import { OrgsController } from './orgs.controller';
import { CampaignController } from './campaign.controller';
import { DonorService } from '../donor/donor.service';
import { Donor, DonorSchema } from '../donor/donor.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
  ],
  providers: [DonorService],
  controllers: [CampaignController],
})
export class CampaignModule {}
