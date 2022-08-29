import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { PaytabsCreateTransactionResponse } from '../../libs/payment-paytabs/dtos/response/paytabs-create-transaction-response.dto';
import { PaymentData } from '../../payment-stripe/schema/paymentData.schema';
import { DonationLog } from '../schema/donation-log.schema';

export class DonorDonateItemResponse {
  @ApiProperty()
  @IsNotEmptyObject()
  paytabsResponse: PaytabsCreateTransactionResponse;

  @ApiProperty()
  @IsNotEmptyObject()
  donationLogResponse: DonationLog;

  @ApiProperty()
  @IsNotEmptyObject()
  paymentDataResponse: PaymentData;
}
