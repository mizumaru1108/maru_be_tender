import { Types } from 'mongoose';

export class PaymentGateWayDto {
  apiKey: string;
  clientKey: string;
  isActive: string;
  isDeleted: string;
  paymentGatewayId: string;
  name: string;
  defaultCurrency: string;
  profileId: string;
  serverKey: string;
  organizationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
