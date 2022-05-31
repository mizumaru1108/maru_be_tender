import { Controller, Post, Body } from '@nestjs/common';
import { PaymentRequestDto } from './payment-paytabs.dto';
import { PaymentPaytabsService } from './payment-paytabs.service';

@Controller('paytabs')
export class PaymentPaytabsController {
  constructor(private readonly paytabsService: PaymentPaytabsService) {}

  @Post('request')
  async request(@Body() payment: PaymentRequestDto) {
    return await this.paytabsService.paytabsRequest(payment);
  }
}
