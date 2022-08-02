import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;
// export type ProjectVendorLogDocument = ProjectVendorLog & Document;

// @Schema({ collection: 'projectVendorLog' })
// export class ProjectVendorLog {
//   @Prop({ type: Types.ObjectId })
//   _id: Types.ObjectId;

//   @Prop({ type: Types.ObjectId })
//   projectId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId })
//   operatorId: Types.ObjectId;

//   @Prop({
//     type: mongoose.Schema.Types.Date,
//     default: mongoose.Schema.Types.Date,
//   })
//   createdAt: string;

//   @Prop({
//     type: mongoose.Schema.Types.Date,
//     default: mongoose.Schema.Types.Date,
//   })
//   updatedAt: string;

//   @Prop()
//   status: string;
// }

@Schema({ collection: 'item' })
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  public organizationId?: Types.ObjectId;

  @Prop()
  public category?: string;

  @Prop({ type: () => String })
  public name?: string;

  @Prop({ type: () => String })
  public createdAt?: String;

  @Prop({ type: () => String })
  public updatedAt?: String;

  @Prop({ type: () => String })
  public defaultPrice?: String;

  @Prop({ type: () => String })
  public coverImage?: String;

  @Prop({ type: () => String })
  public image1?: String;

  @Prop({ type: () => String })
  public image2?: String;

  @Prop({ type: () => String })
  public image3?: String;

  @Prop({ type: () => String })
  public description?: String;

  @Prop({ type: () => String })
  public location?: String;

  @Prop({ type: () => String })
  public currency?: String;

  @Prop({ type: () => String })
  public totalNeed?: String;

  @Prop({ type: () => String })
  public projectId?: String;

  // @Prop({ type: () => String })
  // public hasAc?: String;

  // @Prop({ type: () => String })
  // public hasClassroom?: String;

  // @Prop({ type: () => String })
  // public hasParking?: String;

  // @Prop({ type: () => String })
  // public hasGreenSpace?: String;

  // @Prop({ type: () => String })
  // public hasFemaleSection?: String;

  @Prop({ type: () => String })
  public isDeleted?: String;

  @Prop({ type: () => String })
  public isPublished?: String;

  @Prop({ type: () => String })
  public projectAvatar?: String;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
