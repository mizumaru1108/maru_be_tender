import { Module } from '@nestjs/common';
import { DynamicDonationService } from './dynamic-donation.service';
import { DynamicDonationController } from './dynamic-donation.controller';

@Module({
  controllers: [DynamicDonationController],
  providers: [DynamicDonationService]
})
export class DynamicDonationModule {}
