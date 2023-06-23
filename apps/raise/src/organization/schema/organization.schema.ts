import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import mongoose, { Document } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import paginate from 'mongoose-paginate-v2';

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
  @Prop({ defaul: false })
  zakatTransaction: boolean;
  @Prop({ defaul: false })
  zakatCalculator: boolean;
  @Prop()
  organizationEmail?: string;
  @Prop()
  organizationName?: string;
  @Prop()
  organizationType?: string;
  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  createdAt?: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  updatedAt?: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)
  .plugin(paginate)
  .plugin(aggregatePaginate);
