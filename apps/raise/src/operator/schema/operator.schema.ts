import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
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

  @Prop({ type: () => String })
  public ownerUserId?: String;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
OperatorSchema.plugin(aggregatePaginate);
