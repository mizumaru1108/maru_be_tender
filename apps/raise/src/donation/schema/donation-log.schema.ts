import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { DonationType } from '../../donor/enum/donation-type.enum';
import { DonationStatus } from '../../donor/enum/donation-status.enum';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Donor } from '../../donor/schema/donor.schema';

export type DonationLogDocument = DonationLog & Document;

/**
 * to see the details of the donation, please lookup from donation detail schemas
 */
@Schema({ collection: 'donationLog' })
export class DonationLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop()
  donationLogId?: string;

  @Prop()
  organizationId?: string;

  @Prop()
  projectId?: string;

  @Prop()
  campaignId?: string;

  @Prop()
  donorId?: string;

  /**
   * not to filled but used as a lookup entity (as type refrences)
   */
  @Prop()
  donorDetail?: Donor;

  @Prop()
  itemId?: string;

  @Prop()
  paymentGatewayId: string;

  @Prop()
  paymentGatewayName: string;

  @Prop()
  type?: DonationType;

  @Prop()
  donationStatus: DonationStatus;

  @Prop()
  amount: number;

  /**
   * optional(used if type was item)
   * to substract from item qty
   */
  @Prop()
  purchaseQty?: number;

  @Prop()
  currency: string;

  @Prop()
  transactionId: string;

  @Prop()
  ipAddress: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const DonationLogSchema = SchemaFactory.createForClass(DonationLog)
  .plugin(paginate)
  .plugin(aggregatePaginate);
