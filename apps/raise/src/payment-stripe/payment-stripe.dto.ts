import { Types } from 'mongoose';
import { ZakatLogDto } from 'src/zakat/dto/zakat_log.dto';

export class PaymentRequestDto {
  organizationId: Types.ObjectId;
  campaignId: Types.ObjectId;
  donorId: Types.ObjectId;
  type: string;
  amount: number;
  paymentMethodType: string;
  currency: string;
  success_url: string;
  cancel_url: string;
  price: string;
  quantity: string;
  zakatLogs: Array<ZakatLogDto>;
}
