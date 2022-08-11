import { Module } from '@nestjs/common';
import { UnitDonationService } from './unit-donation.service';
import { UnitDonationController } from './unit-donation.controller';

@Module({
  controllers: [UnitDonationController],
  providers: [UnitDonationService]
})
export class UnitDonationModule {}
