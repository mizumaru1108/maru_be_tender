import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsArray } from 'class-validator';
import Stripe from 'stripe';
import { PaytabsCreateTransactionResponse } from '../../libs/paytabs/dtos/response/paytabs-create-transaction-response.dto';

import { DonationLog } from '../../donation/schema/donation-log.schema';
import { DonationDetail } from '../../donation/schema/donation-detail.schema';
import { PaymentData } from '../../donation/schema/paymentData.schema';

export class DonorDonateResponse {
  @ApiProperty()
  paytabsResponse: PaytabsCreateTransactionResponse | null;

  @ApiProperty()
  stripeResponse: Stripe.Response<Stripe.Checkout.Session> | null;

  @ApiProperty()
  @IsNotEmptyObject()
  createdDonationLog: DonationLog;

  @ApiProperty()
  @IsArray()
  createdDonationDetails: DonationDetail[];

  @ApiProperty()
  @IsNotEmptyObject()
  createdPaymentData: PaymentData;
}
