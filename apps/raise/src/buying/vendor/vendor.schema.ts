import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { DonorApplyVendorDto } from '../../donor/dto/donor-apply-vendor.dto';

export type VendorDocument = Vendor & Document;
export type VendorChartDataDocument = VendorChartData & Document;
export type CampaignVendorLogDocument = CampaignVendorLog & Document;

@Schema({ collection: 'vendor' })
export class Vendor {
  /**
   * Vendor Id
   */
  @Prop()
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
   * idk what it is, but it's available in the current mongo db.
   */
  @Prop()
  channels: string;

  /**
   * Soft delete flag
   */
  @Prop()
  isDeleted: string;

  /**
   * Maybe it's a state where, the donnor already accepted to become a vendor.
   * Y, it's a vendor.
   * N, it's not a vendor yet (donnor type that pending to become a vendor).
   */
  @Prop({ default: 'N' })
  isActive: string;

  /**
   * Vendor Cover Image, it's available in the current mongo db.
   */
  @Prop()
  coverImage: string;

  /**
   * Image 1, it's available in the current mongo db.
   */
  @Prop()
  image1: string;

  /**
   * Image 2, it's available in the current mongo db.
   */
  @Prop()
  image2: string;

  /**
   * Image 3, it's available in the current mongo db.
   */
  @Prop()
  image3: string;

  /**
   * Vendor Avatar, it's available in the current mongo db.
   */
  @Prop()
  vendorAvatar: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  createdAt: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  updatedAt: string;
}

@Schema({ collection: 'campaignVendorLog' })
export class CampaignVendorLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public campaignId?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  public vendorId: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  public createdAt: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  public updatedAt: string;

  @Prop({ type: String })
  public status: string;
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
