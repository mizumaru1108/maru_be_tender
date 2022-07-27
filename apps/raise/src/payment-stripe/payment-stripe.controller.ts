import { Controller, Body, Get, Post, Query } from '@nestjs/common';
import { PaymentRequestDto } from './payment-stripe.dto';
import { PaymentStripeService } from './payment-stripe.service';

@Controller('stripe')
export class PaymentStripeController {
  constructor(private readonly paymentStripeService: PaymentStripeService) {}

  @Post('/request')
  async request(@Body() payment: PaymentRequestDto) {
    return await this.paymentStripeService.stripeRequest(payment);
  }

  @Get('/callback/success')
  async callback(
    @Query('session_id') session_id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.paymentStripeService.stripeCallback(
      session_id,
      organizationId,
    );
  }
}
