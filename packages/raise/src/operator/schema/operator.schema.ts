import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OperatorDocument = Operator & Document;

@Schema({ collection: 'operator' })
export class Operator {
  @Prop({ type: () => String })
  public _id?: string;

  @Prop({ type: () => String, ref: 'projectOperatorMap' })
  public operatorId?: string;

  @Prop({ type: () => String })
  public name?: string;

  @Prop({ type: () => String })
  public createdAt?: String;
}

export const OperatorSchema =
  SchemaFactory.createForClass(Operator);
