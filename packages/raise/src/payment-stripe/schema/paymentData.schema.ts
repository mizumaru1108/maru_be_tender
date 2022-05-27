import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDataDocument = PaymentData & Document;

@Schema({ collection: 'paymentData' })
export class PaymentData {
  @Prop({ type: () => Types.ObjectId })
  public _id?: Types.ObjectId;
  @Prop({ type: () => String })
  public donationId?: string;
  @Prop({ type: () => String })
  public merchantId?: string;
  @Prop({ type: () => String })
  public payerId?: string;
  @Prop({ type: () => String })
  public orderId?: string;
  @Prop({ type: () => String })
  public paymentStatus?: string;
  @Prop({ type: () => String })
  public cardType?: string;
  @Prop({ type: () => String })
  public cardScheme?: string;
  @Prop({ type: () => String })
  public paymentDescription?: string;
  @Prop({ type: () => Number })
  public expiryMonth?: number;
  @Prop({ type: () => Number })
  public expiryYear?: number;
  @Prop({ type: () => String })
  public responseStatus?: string;
  @Prop({ type: () => String })
  public responseCode?: string;
  @Prop({ type: () => String })
  public responseMessage?: string;
  @Prop({ type: () => String })
  public cvvResult?: string;
  @Prop({ type: () => String })
  public avsResult?: string;
  @Prop({ type: () => String })
  public transactionTime?: string;
}

export const PaymentDataSchema = SchemaFactory.createForClass(PaymentData);
