import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ collection: 'campaign' })
export class Campaign {
  @Prop()
  campaignId: string;

  @Prop()
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
  updatedAt: string;

  @Prop()
  isDeleted: string;

  @Prop()
  isPublished: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);