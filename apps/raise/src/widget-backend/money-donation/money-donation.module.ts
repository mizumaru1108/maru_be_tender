import { Module } from '@nestjs/common';
import { MoneyDonationService } from './money-donation.service';
import { MoneyDonationController } from './money-donation.controller';

@Module({
  controllers: [MoneyDonationController],
  providers: [MoneyDonationService]
})
export class MoneyDonationModule {}
