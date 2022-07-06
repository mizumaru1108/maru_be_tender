import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppearanceDocument = Appearance & Document;

@Schema({ collection: 'nonprofitAppearance' })
export class Appearance {
  @Prop()
  id: string;
  @Prop()
  ownerUserId: string;
  @Prop()
  ownerRealmId: string;
  @Prop()
  ourStory: string;
  @Prop()
  whyShouldWe: string;
  @Prop()
  peopleSay: string;
  @Prop()
  detailStory1: string;
  @Prop()
  videoUrl: string;
  @Prop()
  whySupportUs1: string;
  @Prop()
  mainImageUrl: string;
  @Prop()
  secondaryImage: string;
  @Prop()
  eventImagesUrl1: string;
  @Prop()
  favIcon: string;
}

export const AppearanceSchema = SchemaFactory.createForClass(Appearance);
