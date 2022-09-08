import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { UpdateCampaignDto } from './dto/update-campaign-dto';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { CampaignCreateDto } from './dto/campaign-create.dto';

export type CampaignDocument = Campaign & Document;

@Schema({ collection: 'campaign' })
export class Campaign {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  projectId?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  organizationId: Types.ObjectId;

  @Prop()
  campaignId: string;

  @Prop()
  creatorUserId: string;

  @Prop()
  campaignName: string;

  @Prop()
  title: string;

  @Prop()
  campaignType: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop({ default: 'N' })
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

  /**
   * define that the data is ordered by someone and the order is not finished
   */
  @Prop({
    type: mongoose.Schema.Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  amountProgressOnTransaction: Types.Decimal128;

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

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  createdBy: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  updatedAt: string;

  @Prop()
  updatedBy: string;

  @Prop({ default: 'N' })
  isDeleted: string;

  @Prop()
  isPublished: string;

  images: Array<Object>;

  @Prop()
  milestone?: Array<Object>;

  public static compare(
    currentData: CampaignDocument,
    request: UpdateCampaignDto,
  ): CampaignDocument {
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

  public static mapFromCreateRequest(
    scheme: CampaignDocument,
    request: CampaignCreateDto,
  ): CampaignDocument {
    scheme._id = new Types.ObjectId();
    scheme.methods = request.methods;
    scheme.amountProgress = Types.Decimal128.fromString(request.amountProgress);
    scheme.amountTarget = Types.Decimal128.fromString(request.amountTarget);
    scheme.isMoney = request.isMoney;
    scheme.description = request.description;
    scheme.campaignName = request.campaignName;
    scheme.createdAt = dayjs().toISOString();
    scheme.updatedAt = dayjs().toISOString();
    scheme.milestone = request.milestone;
    scheme.campaignType = request.campaignType;
    scheme.organizationId = new Types.ObjectId(request.organizationId);
    scheme.projectId = request.projectId
      ? new Types.ObjectId(request.projectId)
      : undefined;
    return scheme;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)
  .plugin(paginate)
  .plugin(aggregatePaginate);
