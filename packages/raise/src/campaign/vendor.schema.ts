import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({ collection: 'vendor' })
export class Vendor {
  @Prop({type: Types.ObjectId})
  _id:  Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  organizationId: Types.ObjectId;

  @Prop({})
  ownerUserId: string;

  @Prop()
  name: string;

  @Prop()
  channels: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: string;

  @Prop()
  isActive: string;

  @Prop()
  coverImage: string;

  @Prop()
  image1: string;

  @Prop()
  image2: string;

  @Prop()
  image3: string;

  @Prop()
  vendorAvatar: string;

  
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
