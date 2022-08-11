import { Module } from '@nestjs/common';
import { GiftDonationService } from './gift-donation.service';
import { GiftDonationController } from './gift-donation.controller';

@Module({
  controllers: [GiftDonationController],
  providers: [GiftDonationService]
})
export class GiftDonationModule {}
