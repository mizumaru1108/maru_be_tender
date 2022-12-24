import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organization' })
export class Organization {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop()
  contactEmail: string;
  @Prop()
  contactPhone: string;
  @Prop()
  defaultCurrency: string;
  @Prop()
  isoPhoneCode: string;
  @Prop()
  country: string;
  @Prop()
  state: string;
  @Prop()
  city: string;
  @Prop()
  address: string;
  @Prop()
  zipCode: string;
  @Prop()
  aboutHeading: string;
  @Prop()
  aboutBody: string;
  @Prop()
  aboutPicture: string;
  @Prop()
  instagram: string;
  @Prop()
  facebook: string;
  @Prop()
  twitter: string;
  @Prop()
  contactWhatsapp: string;
  @Prop()
  ownerUserId: string;
  @Prop()
  ownerRealmId: string;
  @Prop()
  favicon: string;
  @Prop()
  latitude: string;
  @Prop()
  longitude: string;
  @Prop({ type: JSON })
  currencyOptions: object;
  @Prop()
  defaultLanguage: string;
  @Prop()
  campaignLanguage: string;
  @Prop({ default: [] })
  selectedLanguage: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
