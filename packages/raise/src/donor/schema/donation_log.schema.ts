import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonationLogDocument = DonationLogs & Document;

@Schema({ collection: 'donation_log' }) // for zakat transaction
export class DonationLogs {
  @Prop({ type: () => String })
  public _id?: string;
  @Prop({ type: () => String })
  public nonprofitRealmId?: string;
  @Prop({ type: () => String })
  public campaignId?: string;
  @Prop({ type: () => String })
  donorUserId?: string;
  public type?: string;
  @Prop({ type: () => String })
  public donationStatus?: string;
  @Prop({ type: () => String })
  public paymentGatewayId?: string;
  @Prop({ type: () => String })
  public amount?: string;
  @Prop({ type: () => String })
  public currency?: string;
  @Prop({ type: () => String })
  public transactionId?: string;
  @Prop({ type: () => String })
  public createdAt: string;
  @Prop({ type: () => String })
  public updatedAt: string;
  @Prop({ type: () => String })
  public ipAddress?: string;
}

export const DonationLogSchema = SchemaFactory.createForClass(DonationLogs);
