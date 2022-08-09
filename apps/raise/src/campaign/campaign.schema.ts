import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { UpdateCampaignDto } from './dto/update-campaign-dto';

export type CampaignDocument = Campaign & Document;

@Schema({ collection: 'campaign' })
export class Campaign {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop()
  campaignId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  organizationId: Types.ObjectId;

  @Prop()
  creatorUserId: string;

  @Prop()
  campaignName: string;

  @Prop()
  title: string;

  @Prop()
  campaignType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  projectId?: Types.ObjectId;

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
  methods: string[];

  @Prop()
  currencyCode: string;

  @Prop({
    type: mongoose.Schema.Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  amountProgress: Types.Decimal128;

  @Prop({
    type: mongoose.Schema.Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  amountTarget: Types.Decimal128;

  @Prop()
  coverImage: string;

  @Prop()
  image1: string;

  @Prop()
  image2: string;

  @Prop()
  image3: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  createdAt: string;

  @Prop()
  createdBy: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
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
  milestone?: Array<Object>;

  static compare(currentData: Campaign, request: UpdateCampaignDto): Campaign {
    request.campaignId && (currentData.campaignId = request.campaignId);
    if (request.organizationId) {
      currentData.organizationId = new Types.ObjectId(request.organizationId);
    }
    request.campaignName && (currentData.campaignName = request.campaignName);
    request.campaignType && (currentData.campaignType = request.campaignType);
    if (request.projectId) {
      currentData.projectId = new Types.ObjectId(request.projectId);
    }
    request.description && (currentData.description = request.description);
    request.isMoney && (currentData.isMoney = request.isMoney);
    request.methods && (currentData.methods = request.methods);
    request.currencyCode && (currentData.currencyCode = request.currencyCode);
    if (request.amountProgress) {
      currentData.amountProgress = Types.Decimal128.fromString(
        request.amountProgress,
      );
    }
    if (request.amountTarget) {
      currentData.amountTarget = Types.Decimal128.fromString(
        request.amountTarget,
      );
    }
    currentData.updatedAt = dayjs().toISOString();
    request.isPublished && (currentData.isPublished = request.isPublished);
    request.images && (currentData.images = request.images);
    request.milestone && (currentData.milestone = request.milestone);

    return currentData;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
