import { Module } from '@nestjs/common';
import { PaymentPaypalService } from './payment-paypal.service';
import { PaymentPaypalController } from './payment-paypal.controller';

@Module({
  providers: [PaymentPaypalService],
  controllers: [PaymentPaypalController],
})
export class PaymentPaypalModule {}
