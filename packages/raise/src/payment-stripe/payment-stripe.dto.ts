import { Types } from 'mongoose';

export class PaymentRequestDto {
  organizationId: Types.ObjectId;
  campaignId: string;
  donorId: Types.ObjectId;
  type: string;
  amount: string;
  paymentMethodType: string;
  currency: string;
  success_url: string;
  cancel_url: string;
  price: string;
  quantity: string;
}
