import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CampaignStatus } from '../../campaign/enums/campaign-status.enum';

export type VendorDocument = Vendor & Document;
export type VendorChartDataDocument = VendorChartData & Document;
export type CampaignVendorLogDocument = CampaignVendorLog & Document;

@Schema({
  timestamps: true, // automatically adds createdAt and updatedAt fields with type date
  collection: 'vendor',
})
export class Vendor {
  public readonly _id: mongoose.Types.ObjectId;

  /**
   * Vendor Id
   */
  @Prop({ default: '' })
  vendorId: string;

  /**
   * The user id of the vendor
   */
  @Prop()
  ownerUserId: string;

  /**
   * Vendor Name
   */
  @Prop()
  name: string;

  /**
   * Sumber informasi tentang lelang
   */
  @Prop()
  channels: string;

  /**
   * Soft delete flag
   */
  @Prop({ default: 'N' })
  isDeleted: string;

  /**
   * Maybe it's a state where, the donnor already accepted to become a vendor.
   * Y, it's a vendor.
   * N, it's not a vendor yet (donnor type that pending to become a vendor).
   */
  @Prop({ default: 'N' })
  isActive: string;

  /**
   *  Cover Image
   */
  @Prop()
  coverImage: string;

  /**
   * Image 1
   */
  @Prop()
  image1: string;

  /**
   * Image 2
   */
  @Prop()
  image2: string;

  /**
   * Image 3
   */
  @Prop()
  image3: string;

  /**
   * Vendor Avatar
   */
  @Prop()
  vendorAvatar: string;

  /* actualy it's created automatically, but i defined here to use the prop latter, (ex: vendorData.createdAt) */
  readonly createdAt?: Date;

  /* actualy it's created automatically, but i defined here to use the prop latter, (ex: vendorData.updatedAt) */
  readonly updatedAt?: Date;
}

@Schema({ collection: 'campaignVendorLog' })
export class CampaignVendorLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public _id?: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'campaign',
    required: true,
  })
  public campaignId: mongoose.Schema.Types.ObjectId;

  /**
   * Vendor that applied by the campaign
   */
  @Prop({ default: '' })
  public vendorId: string;

  /**
   * VendorId of the applier (the user who applied the campaign)
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vendor',
  })
  public applierVendorId?: mongoose.Schema.Types.ObjectId;

  /**
   * UserId of applier on this campaign request (the user who applied the campaign)
   */
  @Prop()
  public applierVendorOwnerUserId?: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  public createdAt: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: dayjs().toISOString(),
  })
  public updatedAt: string;

  @Prop({ enum: CampaignStatus, default: CampaignStatus.NEW })
  public status: CampaignStatus;
}

@Schema({ collection: 'vendorChartData' })
export class VendorChartData {
  @Prop({ type: () => String })
  public date?: string;

  @Prop({ type: () => String })
  public vendorId?: string;

  @Prop({ type: () => Number })
  public year?: number;

  @Prop({ type: () => Number })
  public month?: number;

  @Prop({ type: () => Number })
  public wom?: number;

  @Prop({ type: () => Number })
  public woy?: number;

  @Prop({ type: () => Number })
  public dom?: number;

  @Prop({ type: () => Number })
  public doy?: number;

  @Prop({ type: () => Number })
  public income?: number;

  @Prop({ type: () => Number })
  public incomeCount?: number;

  @Prop({ type: () => Number })
  public campaign?: number;

  @Prop({ type: () => Number })
  public campaignCount?: number;

  @Prop({ type: () => String })
  public currency?: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
export const VendorChartDataSchema =
  SchemaFactory.createForClass(VendorChartData);
export const CampaignVendorLogSchema =
  SchemaFactory.createForClass(CampaignVendorLog);
