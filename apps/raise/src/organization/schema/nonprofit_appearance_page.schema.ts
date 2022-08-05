import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppearancePageDocument = AppearancePage & Document;

@Schema({ collection: 'nonprofitAppearancePage' })
export class AppearancePage {
  @Prop()
  id: string;
  @Prop()
  ownerUserId: string;
  @Prop()
  ownerRealmId: string;
  @Prop()
  contactUsCsEmail: string;
  /**Array Of Object */
  @Prop()
  disclaimer: string;
  /**--------------- */
  /**Array Of Object {question:"",answer:""} */
  @Prop()
  faq: string;
  /**--------------- */
}

export const AppearancePageSchema = SchemaFactory.createForClass(AppearancePage);
