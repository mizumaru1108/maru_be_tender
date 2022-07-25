import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BasketDocument = Basket & Document;

@Schema({ collection: 'basket' })
export class Basket {
  @Prop()
  id: string;

  @Prop({ type: Types.ObjectId })
  donorId: Types.ObjectId;

  @Prop()
  campaignId: Types.ObjectId;

  campaign: {
    type: Types.ObjectId;
    ref: 'campaign';
  };

  @Prop()
  donationType: string;

  @Prop()
  amount: number;

  @Prop()
  unit: number;

  @Prop()
  currency: string;

  @Prop()
  isDeleted: boolean;

  @Prop()
  isExpired: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
