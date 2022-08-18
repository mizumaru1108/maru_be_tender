import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Basket, BasketSchema } from './schemas/basket.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { Campaign, CampaignSchema } from 'src/campaign/campaign.schema';
import { ProjectModule } from 'src/project/project.module';

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
export class WidgetsModule { }
