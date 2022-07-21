import { Controller, Body, Post, UseInterceptors } from '@nestjs/common';
import { PaymentRequestDto } from './payment-stripe.dto';
import { PaymentStripeService } from './payment-stripe.service';

@Controller('stripe')
export class PaymentStripeController {
  constructor(private readonly paymentStripeService: PaymentStripeService) {}

  @Post('/request')
  async request(@Body() payment: PaymentRequestDto) {
    return await this.paymentStripeService.stripeRequest(payment);
  }

  @Post('/callback')
  async callback(@Body() payment: PaymentRequestDto) {
    // return await this.paymentStripeService.stripeCallbacks(payment);
  }
}
