import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { TraceInterceptor } from 'src/trace.interceptor';
import { PaymentRequestDto } from './payment-paytabs.dto';
import { PaymentPaytabsService } from './payment-paytabs.service';

@Controller('paytabs')
@UseInterceptors(TraceInterceptor)
export class PaymentPaytabsController {
  constructor(private readonly paytabsService: PaymentPaytabsService) {}

  @Post('request')
  async request(@Body() payment: PaymentRequestDto) {
    return await this.paytabsService.paytabsRequest(payment);
  }
}
