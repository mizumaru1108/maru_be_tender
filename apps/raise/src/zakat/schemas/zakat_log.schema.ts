import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ZakatLogDocument = ZakatLog & Document;

@Schema({ collection: 'zakatLog' })
export class ZakatLog {
  @Prop()
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'DonationLogs' })
  donationLogId: Types.ObjectId;

  @Prop()
  type: string; // {money,silver,gold,stock,mutual_funds}

  @Prop()
  currency: string;

  @Prop({ type: () => Number })
  totalAmount: number;

  @Prop()
  unit: string;

  @Prop({ type: () => Number })
  numberOfUnits: number;

  @Prop({ type: Array })
  details: Array<object>;

  @Prop()
  createdAt: Date;
}

export const ZakatLogSchema = SchemaFactory.createForClass(ZakatLog);
