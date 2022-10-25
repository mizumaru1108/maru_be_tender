import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ZakatLogDto } from 'src/zakat/dto/zakat_log.dto';

export class PaymentRequestDto {
  @IsString ()
  organizationId: Types.ObjectId;
  campaignId: Types.ObjectId;
  @IsString ()
  donorId: Types.ObjectId;
  type: string;
  amount: number;
  paymentMethodType: string;
  currency: string;
  success_url: string;
  cancel_url: string;
  price: string;
  quantity: string;
  extraAmount: number;
  zakatLogs: Array<ZakatLogDto>;
  isAnonymous?: boolean;
  isEmailChecklist?: boolean;
}
