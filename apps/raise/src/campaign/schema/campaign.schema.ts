import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { UpdateCampaignDto } from '../dto/update-campaign-dto';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { CampaignCreateDto } from '../dto/campaign-create.dto';
import { CampaignMilestone } from './campaign-milestone.schema';
import { v4 as uuidv4 } from 'uuid';
import { CampaignUpdateDto } from '../dto/campaign-update.dto';
import { BadRequestException } from '@nestjs/common';

export type CampaignDocument = Campaign & Document;

@Schema({ collection: 'campaign' })
export class Campaign {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId;

  /**
   * Belongs to which organization (omar/gs/etc..)
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organizationId: Types.ObjectId;

  /**
   * This campaign belongs to this project
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  /**
   * ![Deprecated] DONT USE THIS
   */
  @Prop()
  campaignId: string;

  /**
   * User who created this campaign
   */
  @Prop()
  creatorUserId: string;

  /**
   * User who updated this campaign
   */
  @Prop()
  updaterUserId: string;

  @Prop()
  campaignName: string;

  /**
   * For GS? IDK(?)
   * ![Deprecated] IDK IF THIS IS STILL USED, OMAR use campaignName instead
   */
  @Prop()
  title: string;

  @Prop()
  description: string;

  /**
   * TODO: Should be refactored with enum of campaign,
   * but for now, we just use string (still ambiguous from requirement)
   * so it can't be any random string (should be from enum)
   * and more readable.
   */
  @Prop()
  campaignType: string;

  /**
   * ![Deprecated], DONT USE THIS
   */
  @Prop()
  type: string;

  @Prop({ default: 'N' })
  isFinished: string;

  @Prop()
  finishedDate: string;

  /**
   * idk (?), maybe is it money / non money (item/etc..)
   * @example 'Y'
   */
  @Prop({ default: 'Y' })
  isMoney: string;

  /**
   * Idk(?)
   * @example MONEY_TRANSFER
   */
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
   * define that the data is ordered by someone and the order is not finished yet
   * (pending/ongoing/etc ..), will be useful for webhooks
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

  /**
   * for carousels on Frontend
   */
  @Prop()
  image1: string;

  /**
   * for carousels on Frontend
   */
  @Prop()
  image2: string;

  /**
   * for carousels on Frontend
   */
  @Prop()
  image3: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  createdAt: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  updatedAt: string;

  @Prop({ default: 'N' })
  isDeleted: string;

  /**
   * i think it's for GS(?)
   */
  @Prop({ default: 'N' })
  isPublished: string;

  @Prop({ default: [] })
  milestone?: CampaignMilestone[];

  /**
   * Deprecated, use mapFromUpdateRequest instead
   */
  public static compare(
    currentData: CampaignDocument,
    request: UpdateCampaignDto,
  ): CampaignDocument {
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
    // request.milestone && (currentData.milestone = request.milestone);
    return currentData;
  }

  /**
   * Map from create request to campaign document,
   * Progress should be 0 by default (not from request),
   * isFinished should be N by default (not from request),
   * finishedDate should be null by default (not from request),
   * creatorUserId should be from services (not on this map),
   * cover,image1,image2,image3 will be from services (not on this map).
   * @param scheme campaign document
   * @param request create request
   * @returns {CampaignDocument} campaign document
   */
  public static mapFromCreateRequest(
    scheme: CampaignDocument,
    request: CampaignCreateDto,
  ): CampaignDocument {
    scheme._id = new Types.ObjectId();
    scheme.organizationId = new Types.ObjectId(request.organizationId);
    if (request.projectId) {
      scheme.projectId = new Types.ObjectId(request.projectId);
    }
    scheme.campaignName = request.campaignName;
    request.title && (scheme.title = request.title); // if defined then set
    scheme.description = request.description;
    scheme.campaignType = request.campaignType;
    if (request.campaignType === 'project' && !request.projectId) {
      throw new BadRequestException(
        'projectId is required for campaign with type project!',
      );
    }
    request.isMoney && (scheme.isMoney = request.isMoney); // if defined then set else use default
    scheme.methods = request.methods;

    if (!request.currencyCode) {
      // if organization is OMAR, then use SAR
      if (request.organizationId === '61b4794cfe52d41f557f1acc') {
        scheme.currencyCode = 'SAR';
      }
      // if organization is GS, then use GBP
      else if (request.organizationId === '62414373cf00cca3a830814a') {
        scheme.currencyCode = 'GBP';
      }
    } else {
      // if request.currencyCode is not null, then use it
      scheme.currencyCode = request.currencyCode;
    }

    // if target is defined, then use it, else use default
    if (request.amountTarget) {
      scheme.amountTarget = Types.Decimal128.fromString(request.amountTarget);
    }
    request.isPublished && (scheme.isPublished = request.isPublished);

    // if milestone is defined, then use it, else use default
    if (request.milestone) {
      const milestones: CampaignMilestone[] = request.milestone.map(
        (milestone) => {
          const newMilestone: CampaignMilestone = {
            milestoneId: uuidv4(),
            detail: milestone.detail,
            deadline: new Date(milestone.deadline),
            representationalValue: milestone.representationalValue ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return newMilestone;
        },
      );
      scheme.milestone = milestones;
    }
    return scheme;
  }

  /**
   * mapping from update reqeust to campaign document,
   * - progress, is finished, also finished date will be updated by transaction(webhooks),
   * - milestone will updated separately,
   * - project and organization can't be changed (at least for now / waiting for confirmation/clarification),
   * - cover, image1, image2, image3 will be handled by services,
   * @param scheme campaign document
   * @param request update request
   * @returns {CampaignDocument} campaign document
   */
  public static mapFromUpdateRequest(
    scheme: CampaignDocument,
    request: CampaignUpdateDto,
  ): CampaignDocument {
    request.campaignName && (scheme.campaignName = request.campaignName);
    request.title && (scheme.title = request.title);
    request.description && (scheme.description = request.description);
    request.methods && (scheme.methods = request.methods);
    if (request.amountTarget) {
      scheme.amountTarget = Types.Decimal128.fromString(request.amountTarget);
    }
    request.isMoney && (scheme.isMoney = request.isMoney);
    request.description && (scheme.description = request.description);
    request.campaignType && (scheme.campaignType = request.campaignType);
    scheme.updatedAt = dayjs().toISOString();
    return scheme;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)
  .plugin(paginate)
  .plugin(aggregatePaginate);
