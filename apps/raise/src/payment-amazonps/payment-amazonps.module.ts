import { Module } from '@nestjs/common';
import { PaymentAmazonpsService } from './payment-amazonps.service';
import { PaymentAmazonpsController } from './payment-amazonps.controller';

@Module({
  providers: [PaymentAmazonpsService],
  controllers: [PaymentAmazonpsController],
})
export class PaymentAmazonpsModule {}
