import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from '../../payment-stripe/schema/paymentGateway.schema';
import { PaytabsCurrencyEnum } from './enums/paytabs-currency-enum';
import { PaytabsTranClass } from './enums/paytabs-tran-class.enum';
import { PaytabsTranType } from './enums/paytabs-tran-type.enum';
import { PaytabsPaymentRequestPayloadModel } from './models/paytabs-payment-request-payload.model';
import { PaymentRequestDto } from './payment-paytabs.dto';
import { PaymentPaytabsService } from './payment-paytabs.service';

@Controller('paytabs')
export class PaymentPaytabsController {
  // !testing, save to delete.
  constructor(
    private readonly paytabsService: PaymentPaytabsService,
    // private readonly configService: ConfigService,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
  ) {}
  // constructor(private readonly paytabsService: PaymentPaytabsService) {}

  @Post('request')
  async request(@Body() payment: PaymentRequestDto) {
    return await this.paytabsService.paytabsRequest(payment);
  }

  @Post('testing-webhook')
  async testingWebhook(@Body() payment: PaymentRequestDto) {
    console.log('webhook payload', payment);
  }

  @Post('create-transaction')
  async createTransaction() {
    const ObjectId = require('mongoose').Types.ObjectId;
    const paymentGateway = await this.paymentGatewayModel.findOne(
      { organizationId: ObjectId('61b4794cfe52d41f557f1acc') }, // Iqam Global (ommar)
    );
    if (!paymentGateway) {
      throw new BadRequestException(
        'organization can not use Paytabs Payment Gateway',
      );
    }
    // dummy data to test the service
    const testingPayload: PaytabsPaymentRequestPayloadModel = {
      profile_id: paymentGateway.profileId!,
      //! NOTES, will be replaced with the actual amount (not from raw payload cuz it can be changed with inspect element / fraud request from postman)
      cart_amount: 1234,
      cart_currency: PaytabsCurrencyEnum.SAR,
      cart_description: 'testing',
      cart_id: 'testing',
      callback:
        'https://0pnncvgvzj.execute-api.ap-south-1.amazonaws.com/dev/v1/paytabs/callback',
      tran_type: PaytabsTranType.SALE,
      tran_class: PaytabsTranClass.ECOM,
      framed: true,
      hide_shipping: true,
    };
    const response = await this.paytabsService.createTransaction(
      testingPayload,
      paymentGateway.serverKey!,
    );
    console.log(response);
  }
}
