import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FaqDocument = Faq & Document;

@Schema({ collection: 'faq' })
export class Faq {
  @Prop()
  id: string;
  @Prop()
  organizationId: Types.ObjectId;
  @Prop()
  question: string;
  @Prop()
  answer: string;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
