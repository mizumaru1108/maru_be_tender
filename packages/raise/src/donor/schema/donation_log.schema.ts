import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonationLogDocument = DonationLogs & Document;

@Schema({ collection: 'donation_log' }) // for zakat transaction
export class DonationLogs {
  // @Prop()
  // donorId: string;

  // @Prop()
  // nonprofitRealmId: string;

  @Prop()
  organizationId: string;

  @Prop()
  campaignId: string;

  @Prop()
  donorId: string;

  @Prop()
  donorName: string;

  @Prop()
  type: string;

  @Prop()
  donationStatus: string;

  @Prop()
  paymentGatewayId: string;

  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  transactionId: string;

  @Prop()
  ipAddress: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const DonationLogSchema = SchemaFactory.createForClass(DonationLogs);
