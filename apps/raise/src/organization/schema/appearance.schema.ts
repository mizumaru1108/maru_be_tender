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
  primaryColor: string;
  @Prop()
  secondaryColor: string;
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
  detailStory2: string;
  @Prop()
  detailStory3: string;
  @Prop()
  videoUrl: string;
  @Prop()
  whySupportUs1: string;
  @Prop()
  whySupportUs2: string;
  @Prop()
  whySupportUs3: string;
  @Prop()
  mainImageUrl: string;
  @Prop()
  secondaryImage: string;
  @Prop()
  eventImagesUrl1: string;
  @Prop()
  eventImagesUrl2: string;
  @Prop()
  eventImagesUrl3: string;
  @Prop()
  favIcon: string;
  @Prop()
  themesColor: string;
  @Prop()
  usePallete: boolean;
  @Prop()
  logo: string;
  @Prop()
  headerAndFooter: string;
  @Prop()
  accent: string;
  @Prop()
  lButton: string;
  @Prop()
  lText: string;
}

export const AppearanceSchema = SchemaFactory.createForClass(Appearance);
