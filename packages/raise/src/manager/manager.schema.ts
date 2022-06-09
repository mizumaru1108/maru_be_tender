import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManagerChartDataDocument = ManagerChartData & Document;

@Schema({ collection: 'chartData' })
export class ManagerChartData {
  @Prop({ type: () => String })
  public date?: string;

  @Prop({ type: () => String })
  public managerId?: string;

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
  public donation?: number;

  @Prop({ type: () => Number })
  public donationCount?: number;

  @Prop({ type: () => Number })
  public moneyPaid?: number;

  @Prop({ type: () => Number })
  public moneyPaidCount?: number;

  @Prop({ type: () => String })
  public currency?: string;
}

export const ManagerChartDataSchema =
  SchemaFactory.createForClass(ManagerChartData);
