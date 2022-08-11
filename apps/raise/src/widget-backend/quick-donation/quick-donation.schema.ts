import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GiftDetails, PaymentDetails } from './dto/create-quick-donation.dto';

export type QuickDonateDocument = QuickDonate & Document;

@Schema({ collection: 'QuickDonate' })
export class QuickDonate {
  @Prop()
  id: string;

  @Prop({ type: Types.ObjectId })
  donationId: Types.ObjectId;

  @Prop()
  organizationId: Types.ObjectId;  

  @Prop()
  donorEmail: string;

  donorInfo: {
    type: Types.ObjectId,
    ref: 'donorInfo'
  }

  @Prop()
  donateAmount: string;

  @Prop()
  donatePurpose: string;

  @Prop()
  regularity: "Once"|"Daily"|"Weekly"|"Monthly";

  @Prop()
  donationType: "Just"|"Gift";

  @Prop()
  giftDetail: GiftDetails;

  @Prop()
  paymentDetail: PaymentDetails;

  @Prop()
  donationDate: string;
}

export const QuickDonateSchema = SchemaFactory.createForClass(QuickDonate);
