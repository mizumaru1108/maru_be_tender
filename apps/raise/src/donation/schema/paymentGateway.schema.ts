import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentGatewayDocument = PaymentGateway & Document;

@Schema({ collection: 'paymentGateway' })
export class PaymentGateway {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  public organizationId: Types.ObjectId;
  @Prop({ type: () => String })
  public name?: string;
  @Prop({ type: () => String })
  public defaultCurrency?: string;
  @Prop({ type: () => String })
  public profileId?: string;
  @Prop({ type: () => String })
  public apiKey?: string;
  @Prop({ type: () => String })
  public serverKey?: string;
  @Prop({ type: () => String })
  public clientKey?: string;
  @Prop({ type: () => String })
  public createdAt?: string;
  @Prop({ type: () => String })
  public updatedAt?: string;
  @Prop({ type: () => String })
  public isDeleted?: string;
  @Prop({ type: () => String })
  public isActive?: string;
  @Prop({ type: () => String })
  public paymentMethod?: string;
  @Prop({ type: () => String })
  public profileName?: string;
  @Prop({ type: () => String })
  public isTestMode?: string;
  @Prop({ type: () => String })
  public isLiveMode?: string;
}

export const PaymentGatewaySchema =
  SchemaFactory.createForClass(PaymentGateway);
