import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop()
  campaignId: string;
  @Prop()
  vendorId: string;
  @Prop()
  status: string;
  @Prop()
  createdAt: string;
  @Prop()
  updatedAt: string;
  @Prop()
  campaignVendorLogId: string;
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
