import { Controller, Body, Get, Post, Query, Req } from '@nestjs/common';
import { PaymentRequestCartDto } from './dto';
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
  @Post('/requestCart')
  async requestCart(@Body() payment: PaymentRequestCartDto) {
    return await this.paymentStripeService.stripeRequestBasket(payment);
  }

  @Post('/confirmPaymentIntent')
  async callbackPaymentIntent(@Body() payment: PaymentRequestCartDto) {
    return await this.paymentStripeService.stripeConfirmPaymentIntent(payment);
  }

  @Get('/callbackCart/success')
  async callbackCart(
    @Query('session_id') session_id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.paymentStripeService.stripeCallbackBasket(
      session_id,
      organizationId,
    );
  }

  @Post('/reqPayStripe')
  async reqPayStripe(@Body() payment: PaymentRequestDto) {
    return await this.paymentStripeService.reqPayStripe(payment);
  }

  @Post('/payStripeWebHook')
  async payStripWebHook(@Body() payLoad: any, @Req() req: any) {
    return await this.paymentStripeService.payStripWebHook(payLoad);
  }
}
