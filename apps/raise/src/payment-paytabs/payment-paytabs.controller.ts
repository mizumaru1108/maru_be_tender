import { Controller, Body, Post, HttpStatus } from '@nestjs/common';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
// Service
import { PaymentPaytabsService } from './payment-paytabs.service';
// DTO
import { PaymentPaytabsDto, PaymentPaytabsCallbackDto } from './dto';
// import { PaytabsIpnWebhookResponsePayload } from 'src/libs/paytabs/dtos/response/paytabs-ipn-webhook-response-payload.dto';
//

@Controller('paytabs')
export class PaymentPaytabsController {
  constructor(private readonly paymentPaytabsService: PaymentPaytabsService) {}

  @Post('/request-single')
  async requestSingle(@Body() payment: PaymentPaytabsDto) {
    return await this.paymentPaytabsService.paytabsRequest(payment);
  }

  @Post('/callback-single')
  async callbackSingle(@Body() payload: PaymentPaytabsCallbackDto) {
    const callbackResponse =
      await this.paymentPaytabsService.paytabsSingleCallback(payload);

    return baseResponseHelper(
      callbackResponse,
      HttpStatus.OK,
      callbackResponse.message,
    );
  }
}
