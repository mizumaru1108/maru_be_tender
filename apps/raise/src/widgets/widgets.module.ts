import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { ProjectModule } from 'src/project/project.module';
import { Basket, BasketSchema } from './schemas/basket.schema';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';

@Module({
  imports: [
    ProjectModule,
    MongooseModule.forFeature([
      {
        name: Basket.name,
        schema: BasketSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
  ],
  providers: [WidgetsService],
  controllers: [WidgetsController],
})
export class WidgetsModule {}
