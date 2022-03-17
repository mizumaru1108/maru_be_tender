import { Module } from '@nestjs/common';
import { PaymentStripeService } from './payment-stripe.service';
import { PaymentStripeController } from './payment-stripe.controller';

@Module({
  providers: [PaymentStripeService],
  controllers: [PaymentStripeController]
})
export class PaymentStripeModule {}
