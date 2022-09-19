import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type DonationLogsDocument = DonationLogs & Document;

@Schema({ collection: 'donation_log' }) // for zakat transaction
export class DonationLogs {
  @Prop({ type: () => String })
  public _id?: string;
  @Prop({ type: () => String, ref: 'Organization' })
  public nonprofitRealmId?: string;
  @Prop({ type: String, ref: 'Campaign' })
  campaign?: string;
  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  public campaignId?: Types.ObjectId;
  @Prop({ type: String, ref: 'Donor' })
  donor?: string;
  @Prop({ type: String, ref: 'User' })
  donorUserId?: string;
  @Prop({ type: () => String })
  public type?: string;
  @Prop({ type: () => String })
  public donationStatus?: string;
  @Prop({ type: () => String })
  public paymentGatewayId?: string;
  @Prop({ type: () => Number })
  public amount?: number;
  @Prop({ type: () => Number })
  public extraAmount?: number;
  @Prop({ type: () => String })
  public currency?: string;
  @Prop({ type: () => String })
  public transactionId?: string;
  @Prop({ type: () => Date })
  public createdAt: Date;
  @Prop({ type: () => Date })
  public updatedAt: Date;
  @Prop({ type: () => String })
  public ipAddress?: string;
}

export const DonationLogsSchema = SchemaFactory.createForClass(DonationLogs)
  .plugin(paginate)
  .plugin(aggregatePaginate);
