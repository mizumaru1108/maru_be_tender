import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { DonationLog } from '../../donation/schema/donation-log.schema';
import { PaymentData } from '../../donation/schema/paymentData.schema';
import { PaytabsCreateTransactionResponse } from '../../libs/paytabs/dtos/response/paytabs-create-transaction-response.dto';

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
