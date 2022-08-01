import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HrDocument = Hr & Document;

@Schema({ collection: 'donor' })
export class Hr {
  @Prop({ type: Types.ObjectId })
  public _id?: Types.ObjectId;

  @Prop({ createdAt: String })
  public createdAt: string;

  @Prop({ updatedAt: String })
  public updatedAt: string;
}

export const HrSchema = SchemaFactory.createForClass(Hr);
