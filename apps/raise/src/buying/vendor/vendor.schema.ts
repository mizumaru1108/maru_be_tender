import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type VendorDocument = Vendor & Document;
export type VendorChartDataDocument = VendorChartData & Document;
export type CampaignVendorLogDocument = CampaignVendorLog & Document;

@Schema({ collection: 'vendor' })
export class Vendor {
  @Prop()
  vendorId: string;
  @Prop()
  name: string;
  @Prop()
  ownerUserId: string;
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
