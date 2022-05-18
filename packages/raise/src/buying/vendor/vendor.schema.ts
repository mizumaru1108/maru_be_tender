import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({ collection: 'vendor' })
export class Vendor {
  @Prop()
  name: string;
  @Prop()
  ownerUserId: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
