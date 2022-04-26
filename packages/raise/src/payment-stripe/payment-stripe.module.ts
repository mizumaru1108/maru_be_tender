import { Module } from '@nestjs/common';
import { PaymentStripeService } from './payment-stripe.service';
import { PaymentStripeController } from './payment-stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentGateway, PaymentGatewaySchema } from './paymentGateway.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
    ]),
  ],
  providers: [PaymentStripeService],
  controllers: [PaymentStripeController],
})
export class PaymentStripeModule {}
