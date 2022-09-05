import { User } from '@fusionauth/typescript-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Campaign } from '../../campaign/campaign.schema';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Item } from '../../item/item.schema';
import { Project } from '../../project/project.schema';
import { DonationType } from '../enum/donation-type.enum';
import { DonationLog } from './donation-log.schema';

export type DonationDetailDocument = DonationDetail & Document;

/**
 * This schema is for donation details refrences from DonationLog Schema
 */
@Schema({
  timestamps: true, // will created CreatedAt and UpdatedAt fields automatically
  toJSON: { virtuals: true }, // for populate virtual fields
  toObject: { virtuals: true }, // for populate virtual fields
  id: false, // disable id field on populated virtual fields so it won't be displayed in response (doubled)
})
export class DonationDetail {
  _id?: string | Types.ObjectId;

  @Prop({ enum: DonationType, required: true })
  donationType: DonationType;

  /**
   * As a refrence for lookup from donationLog
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'donationLog' })
  donationLogId: Types.ObjectId | DonationLog;

  /**
   * not to filled, just to use as a type
   */
  donationLogDetail?: DonationLog;

  /**
   * Refrence to the campaign this DonationDetail belongs to.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'campaign', default: null })
  campaignId?: Types.ObjectId | Campaign;

  /**
   * virtual props (populated), just for accessing purposes. Not stored in the database.
   * so we don't need to use @Prop() decorator. (not to filled, but to use)
   * @example DonationDetail.campaignDetails.campaignName / DonationDetail.campaignDetails.title
   */
  campaignDetails?: Campaign;

  /**
   * Refrence to the project this DonationDetail belongs to.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'project', default: null })
  projectId?: Types.ObjectId | Project;

  projectDetails?: Project;

  /**
   * Refrence to the Item this DonationDetail belongs to. (just in case user can DonationDetail on the item)
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'item', default: null })
  itemId?: Types.ObjectId | Item;

  itemDetails?: Item;

  /**
   * qty of the purchased item
   */
  @Prop({ default: null })
  qty?: number;

  /**
   * filled with sum of the qty * item price / donate amount on campaign/project
   */
  @Prop({ default: null })
  totalAmount: number;

  /**
   * i don't use props decorator here, it's just for accessing the auto created fields
   * @example DonationDetail.createdAt
   */
  public createdAt?: Date;

  public updatedAt?: Date;
}

export const DonationDetailSchema = SchemaFactory.createForClass(DonationDetail)
  .plugin(paginate)
  .plugin(aggregatePaginate);
