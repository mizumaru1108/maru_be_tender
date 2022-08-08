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

  static mapFromUpdateDto(dto: UpdateCampaignDto): Campaign {
    const campaign = new Campaign();
    dto.campaignId && (campaign.campaignId = dto.campaignId);
    dto.organizationId &&
      (campaign.organizationId = new Types.ObjectId(dto.organizationId));
    // dto.creatorUserId && (campaign.creatorUserId = dto.creatorUserId);
    dto.campaignName && (campaign.campaignName = dto.campaignName);
    dto.campaignType && (campaign.campaignType = dto.campaignType);
    dto.projectId && (campaign.projectId = new Types.ObjectId(dto.projectId));
    // dto.type && (campaign.type = dto.type);
    dto.description && (campaign.description = dto.description);
    dto.isMoney && (campaign.isMoney = dto.isMoney);
    dto.methods && (campaign.methods = dto.methods);
    dto.currencyCode && (campaign.currencyCode = dto.currencyCode);
    // dto.amountProgress && (campaign.amountProgress = dto.amountProgress);
    if (dto.amountProgress) {
      campaign.amountProgress = Types.Decimal128.fromString(dto.amountProgress);
    }
    if (dto.amountTarget) {
      campaign.amountTarget = Types.Decimal128.fromString(dto.amountTarget);
    }
    // dto.coverImage && (campaign.coverImage = dto.coverImage);
    // dto.image1 && (campaign.image1 = dto.image1);
    // dto.image2 && (campaign.image2 = dto.image2);
    // dto.image3 && (campaign.image3 = dto.image3);
    campaign.updatedAt = dayjs().toISOString();
    dto.isPublished && (campaign.isPublished = dto.isPublished);
    // dto.images && (campaign.images = dto.images);
    // dto.milestone && (campaign.milestone = dto.milestone);
    return campaign;
  }

  static compare(currentData: Campaign, request: UpdateCampaignDto): Campaign {
    request.campaignId && (currentData.campaignId = request.campaignId);
    if (request.organizationId) {
      currentData.organizationId = new Types.ObjectId(request.organizationId);
    }
    // request.creatorUserId &&
    //   (currentData.creatorUserId = request.creatorUserId);
    request.campaignName && (currentData.campaignName = request.campaignName);
    request.campaignType && (currentData.campaignType = request.campaignType);
    if (request.projectId) {
      currentData.projectId = new Types.ObjectId(request.projectId);
    }
    // request.type && (currentData.type = request.type);
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
    // request.coverImage && (currentData.coverImage = request.coverImage);
    // request.image1 && (currentData.image1 = request.image1);
    // request.image2 && (currentData.image2 = request.image2);
    // request.image3 && (currentData.image3 = request.image3);
    currentData.updatedAt = dayjs().toISOString();
    request.isPublished && (currentData.isPublished = request.isPublished);
    request.images && (currentData.images = request.images);
    request.milestone && (currentData.milestone = request.milestone);

    return currentData;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
