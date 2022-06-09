import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OperatorChartDataDocument = OperatorChartData & Document;

@Schema({ collection: 'operatorChartData' })
export class OperatorChartData {
  @Prop({ type: () => String })
  public date?: string;

  @Prop({ type: () => String })
  public operatorId?: string;

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
  public moneySpend?: number;

  @Prop({ type: () => Number })
  public moneySpendCount?: number;

  @Prop({ type: () => String })
  public currency?: string;
}

export const OperatorChartDataSchema =
  SchemaFactory.createForClass(OperatorChartData);
