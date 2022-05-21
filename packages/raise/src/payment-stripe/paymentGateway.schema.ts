import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentGatewayDocument = PaymentGateway & Document;

@Schema({ collection: 'paymentGateway' })
export class PaymentGateway {
  @Prop({ type: () => Types.ObjectId })
  public _id?: Types.ObjectId;
  @Prop({ type: () => String })
  public organizationId?: string;
  @Prop({ type: () => String })
  public name?: string;
  @Prop({ type: () => String })
  public defaultCurrency?: string;
  @Prop({ type: () => String })
  public profileId?: string;
  @Prop({ type: () => String })
  public apiKey?: string;
  @Prop({ type: () => String })
  public createdAt?: string;
  @Prop({ type: () => String })
  public updatedAt?: string;
  @Prop({ type: () => String })
  public isDeleted?: string;
  @Prop({ type: () => String })
  public isActive?: string;
}

export const PaymentGatewaySchema =
  SchemaFactory.createForClass(PaymentGateway);