import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type AppearanceNavigationDocument = AppearanceNavigation & Document;

@Schema({ collection: 'nonprofitAppearanceNavigation' })
export class AppearanceNavigation {

  @Prop()
  id?: string;

  @Prop()
  ownerUserId?: string;

  @Prop()
  ownerRealmId?: string;

  @Prop()
  titleThumbnail?: string;

  @Prop()
  photoThumbnail?: string;

  @Prop()
  descriptionThumbnail?: string;

  @Prop()
  mission?: string[];

  @Prop()
  iconForMission?: string;

  @Prop()
  titleActivities?: string;

  @Prop()
  photoOfActivity?: string;

  @Prop()
  descriptionActivity?: string;

  @Prop()
  detailDescriptionActivity?: string;

  @Prop()
  whyUs?: string[];

  @Prop()
  titleWhyUs: string;

  @Prop()
  descriptionWhyUs: string;

  @Prop()
  linkCampaign?: string[];

  @Prop()
  vision?: string[];

  @Prop()
  linkedYoutube?: string;

  @Prop()
  companyValues?: string[];

  @Prop()
  titleCompany: string;

  @Prop()
  descriptionCompany: string;

  @Prop()
  iconForValues?: string;

  @Prop()
  teamMemberAddUser?: string[];

  @Prop()
  recentNewsTitle?: string;

  @Prop()
  date?: string;

  @Prop()
  news?: string[];

  @Prop()
  recentNews?: string;

  @Prop()
  recentNewsTittle?: string;

  @Prop()
  recentNewsDesc?: string;

  @Prop(() => String)
  page?: string;

  @Prop()
  organizationId?: string;

  @Prop()
  isDeleted: string;

  @Prop()
  isActive: string;

  @Prop()
  createdAt?: string;

  @Prop()
  updatedAt?: string;

  @Prop()
  photoWhyUs?: string;

  @Prop()
  features?: string;

  @Prop()
  featuresTitle?: string;

  @Prop()
  featuresDesc?: string;

  @Prop()
  featuresItem?: string[];
}

export const AppearanceNavigationSchema = SchemaFactory.createForClass(AppearanceNavigation)
  .plugin(paginate)
  .plugin(aggregatePaginate);
