import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppearanceNavigationDocument = AppearanceNavigation & Document;

@Schema({ collection: 'nonprofitAppearanceNavigation' })
export class AppearanceNavigation {
  @Prop()
  id: string;
  @Prop()
  ownerUserId: string;
  @Prop()
  ownerRealmId: string;
  @Prop()
  titleThumbnail: string;
  @Prop()
  photoThumbnail: string;
  @Prop()
  descriptionThumbnail: string;

  /** Company Value Array of Object */
  @Prop()
  mission: string[];
  /** ------------------------------ */

  @Prop()
  iconForMission: string;
  @Prop()
  titleActivities: string;
  @Prop()
  photoOfActivity: string;
  @Prop()
  descriptionActivity: string;
  @Prop()
  detailDescriptionActivity: string;

  /** Caompany Value Array of Object {whyUs:"",iconForMission:""} */
  @Prop()
  whyUs: string[];
  /** ------------------------------ */

  /** Caompany Value Array of Object */
  @Prop()
  linkCampaign: string[];
  /** ------------------------------ */

  @Prop()
  vision: string[];
  // @Prop()
  // mission: string;
  @Prop()
  linkedYoutube: string;

  /** Caompany Value Array of Object */
  @Prop()
  companyValues: string[];
  /** ------------------------------ */

  @Prop()
  iconForValues: string;

  /** Caompany Value Array of Object */
  @Prop()
  teamMemberAddUser: string[];
  /** ------------------------------ */

  @Prop()
  recentNewsTitle: string;
  @Prop()
  date: string;

  /** News Setting Page Blog {news:"",photo:"",desc:"",date:""} */
  @Prop()
  news: string[];
  /** ------------------------------ */

  @Prop()
  page: string;

  @Prop()
  organizationId: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

}

export const AppearanceNavigationSchema = SchemaFactory.createForClass(AppearanceNavigation);
