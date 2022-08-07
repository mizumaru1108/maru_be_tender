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

  @Prop()
  disclaimer: string[];

  @Prop()
  faq: string[];

  @Prop()
  organizationId: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const AppearancePageSchema = SchemaFactory.createForClass(AppearancePage);
