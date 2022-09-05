import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsArray } from 'class-validator';
import Stripe from 'stripe';
import { PaytabsCreateTransactionResponse } from '../../libs/paytabs/dtos/response/paytabs-create-transaction-response.dto';
import { PaymentData } from '../../payment-stripe/schema/paymentData.schema';
import { DonationDetail } from '../schema/donation-detail.schema';
import { DonationLog } from '../schema/donation-log.schema';

export class DonorDonateResponse {
  @ApiProperty()
  paytabsResponse: PaytabsCreateTransactionResponse | null;

  @ApiProperty()
  stripeResponse: Stripe.Response<Stripe.Checkout.Session> | null = null;

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
