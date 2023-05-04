import { IsString } from 'class-validator';
import { IsArray } from 'class-validator';
import { Types } from 'mongoose';

import { IPaymentIntent } from 'src/tender-commons/types/stripe';
import { ZakatLogDto } from 'src/zakat/dto/zakat_log.dto';

export class PaymentRequestCartDto {
  @IsString()
  organizationId: Types.ObjectId;
  campaignId?: Types.ObjectId;
  @IsString()
  donorId: Types.ObjectId;
  type: string;
  total_amount: number;
  currency: string;
  success_url: string;
  cancel_url: string;
  price: string;
  quantity: string;
  isAnonymous?: boolean;
  isEmailChecklist?: boolean;

  amount?: number;
  paymentMethodType?: string;
  extraAmount?: number;
  zakatLogs?: Array<ZakatLogDto>;
  campaignTitle?: string;

  data_basket?: {
    _id: string;
    organizationId: Types.ObjectId;
    amount: number;
  }[];
  payment_intent?: IPaymentIntent | null;
}
