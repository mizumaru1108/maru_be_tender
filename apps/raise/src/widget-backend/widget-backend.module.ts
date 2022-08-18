import { Module } from '@nestjs/common';
import { WidgetBackendService } from './widget-backend.service';
import { WidgetBackendController } from './widget-backend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Donation, DonationSchema } from './schemas/donation-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donation.name,
        schema: DonationSchema
      }
    ])
  ],
  controllers: [WidgetBackendController],
  providers: [WidgetBackendService]
})
export class WidgetBackendModule { }
