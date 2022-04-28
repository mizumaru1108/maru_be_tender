import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetalPriceDocument = MetalPrice & Document;

@Schema({ collection: 'metal_price' })
export class MetalPrice {
  @Prop()
  id: string;

  @Prop()
  metalType: string;

  @Prop()
  currency: string;

  @Prop({ type: JSON })
  rates: object;

  @Prop()
  unit: string;

  @Prop()
  createdDate: string;

  @Prop()
  isActive: boolean;
}

export const MetalPriceSchema = SchemaFactory.createForClass(MetalPrice);
