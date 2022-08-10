import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { UpdateItemDto } from './dto/update-item.dto';

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
  public organizationId: Types.ObjectId;

  @Prop()
  public category?: string;

  @Prop({ required: true })
  public name: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: mongoose.Schema.Types.Date,
  })
  public createdAt?: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: mongoose.Schema.Types.Date,
  })
  public updatedAt?: string;

  @Prop()
  public defaultPrice?: string;

  @Prop()
  public coverImage?: string;

  @Prop()
  public image1?: string;

  @Prop()
  public image2?: string;

  @Prop()
  public image3?: string;

  @Prop()
  public description?: string;

  @Prop()
  public location?: string;

  @Prop()
  public currency?: string;

  @Prop()
  public totalNeed?: string;

  @Prop()
  public projectId?: string;

  @Prop()
  public isDeleted?: string;

  @Prop()
  public isPublished?: string;

  @Prop()
  public projectAvatar?: string;

  static compare(
    currentData: ItemDocument,
    request: UpdateItemDto,
  ): ItemDocument {
    request.organizationId &&
      (currentData.organizationId = new Types.ObjectId(request.organizationId));
    request.category && (currentData.category = request.category);
    request.defaultPrice && (currentData.defaultPrice = request.defaultPrice);
    request.name && (currentData.name = request.name);
    request.totalNeed && (currentData.totalNeed = request.totalNeed);
    request.description && (currentData.description = request.description);
    return currentData;
  }
}

export const ItemSchema = SchemaFactory.createForClass(Item);
