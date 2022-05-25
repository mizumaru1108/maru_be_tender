import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ collection: 'expense' })
export class Expense {
  @Prop()
  id: string;

  @Prop()
  referenceId: string;

  @Prop()
  campaignId: string;

  campaign: {
    type: Types.ObjectId;
    ref: 'campaign';
  };

  @Prop()
  expenseDate: string;

  @Prop()
  amount: string;

  @Prop()
  createdDate: string;

  @Prop()
  createdBy: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
