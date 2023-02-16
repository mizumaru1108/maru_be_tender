import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import paginate from 'mongoose-paginate-v2';
import { CampaignCreateDto } from '../dto/campaign-create.dto';
import { CampaignUpdateDto } from '../dto/campaign-update.dto';
import { CampaignMilestone } from './campaign-milestone.schema';

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
  milestone: CampaignMilestone[];

  @Prop({ default: [] })
  contentLanguage: {
    language: string;
    value: string;
    active: boolean;
    title: string;
    description: string;
  }[];

  /**
   * Map from create request to campaign document,
   * Progress should be 0 by default (not from request) later on updated by webhook,
   * isFinished should be N by default (not from request) later on updated by webhook,
   * finishedDate should be null by default (not from request) later on updated by webhook,
   * creatorUserId should be from services (not on this map),
   * cover,image1,image2,image3 will be from services (not on this map).
   * why use both of dto ?, because the only diffrence is how to process image,
   * for ceratedAt and updatedAt, we use default value on schema, on edit we update it on service
   * @param scheme campaign document
   * @param request create request
   * @returns {CampaignDocument} campaign document
   */
  public static mapFromRequest(
    scheme: CampaignDocument,
    request: CampaignCreateDto | CampaignUpdateDto,
  ): CampaignDocument {
    if (!scheme._id) scheme._id = new Types.ObjectId();
    scheme.organizationId = new Types.ObjectId(request.organizationId);
    scheme.projectId = new Types.ObjectId(request.projectId);
    scheme.campaignName = request.campaignName;
    request.title && (scheme.title = request.title); // if defined then set
    scheme.description = request.description;
    scheme.campaignType = request.campaignType;
    scheme.isMoney = request.isMoney; // if defined then set else use default
    scheme.methods = request.methods;

    // if there's no currency code, match by organization
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
      let totalRepresentational = 0;
      const milestones: CampaignMilestone[] = request.milestone.map(
        (milestone) => {
          totalRepresentational += milestone.representationalValue;
          const newMilestone = CampaignMilestone.mapFromRequest(milestone);
          return newMilestone;
        },
      );
      if (totalRepresentational !== 100) {
        throw new BadRequestException(
          'Total representational value must be 100!',
        );
      }
      scheme.milestone = milestones;
    }
    return scheme;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)
  .plugin(paginate)
  .plugin(aggregatePaginate);
