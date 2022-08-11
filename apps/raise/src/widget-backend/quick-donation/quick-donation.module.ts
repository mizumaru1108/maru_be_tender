import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuickDonationService } from './quick-donation.service';
import { QuickDonationController } from './quick-donation.controller';
import { QuickDonate, QuickDonateSchema } from './quick-donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([      
      {
        name: QuickDonate.name,
        schema: QuickDonateSchema,
      },
    ]),
  ],
  controllers: [QuickDonationController],
  providers: [QuickDonationService]
})
export class QuickDonationModule {}
