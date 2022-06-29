import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ collection: 'campaign' })
export class Campaign {
  @Prop()
  campaignId: string;

  @Prop({ type: Types.ObjectId })
  organizationId: string;

  @Prop()
  name: string;

  @Prop()
  projectId: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  isFinished: string;

  @Prop()
  finishedDate: string;

  @Prop()
  isMoney: string;

  @Prop()
  methods: string;

  @Prop()
  currencyCode: string;

  @Prop()
  amountProgress: string;

  @Prop()
  amountTarget: string;

  @Prop()
  coverImage: string;

  @Prop()
  image1: string;

  @Prop()
  image2: string;

  @Prop()
  image3: string;

  @Prop()
  createdAt: string;

  @Prop()
  createdBy: string;

  @Prop()
  updatedAt: string;

  @Prop()
  updatedBy: string;

  @Prop()
  isDeleted: string;

  @Prop()
  isPublished: string;

  @Prop()
  images: Array<Object>;

  @Prop()
  milestone: Array<Object>;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
