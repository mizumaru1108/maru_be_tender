import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DonationType } from '../enum/donation-type.enum';
import { DonationStatus } from '../enum/donation-status.enum';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type DonationLogDocument = DonationLog & Document;

@Schema({ collection: 'donationLog' })
export class DonationLog {
  @Prop()
  donationLogId: string;

  @Prop()
  organizationId: string;

  @Prop()
  projectId: string;

  @Prop()
  campaignId: string;

  @Prop()
  donorId: string;

  @Prop()
  itemId: string;

  @Prop()
  type: DonationType;

  @Prop()
  donationStatus: DonationStatus;

  @Prop()
  paymentGatewayId: string;

  @Prop()
  amount: number;

  @Prop()
  purchaseQty?: number;

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

export const DonationLogSchema = SchemaFactory.createForClass(DonationLog)
  .plugin(paginate)
  .plugin(aggregatePaginate);
