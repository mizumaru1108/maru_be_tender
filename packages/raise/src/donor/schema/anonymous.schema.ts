import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnonymousDocument = Anonymous & Document;

@Schema({ collection: 'anonymous' })
export class Anonymous {
  @Prop()
  isAnonymous: boolean;

  @Prop()
  id: string;

  @Prop()
  donorLogId: string;

  @Prop()
  email: string;

  @Prop()
  about: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  address: string;

  @Prop()
  country: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  linkedin: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  mobile: string;
}

export const AnonymousSchema = SchemaFactory.createForClass(Anonymous);
