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

  static mapFromUpdateDto(dto: UpdateItemDto): Item {
    const item = new Item();
    dto.organizationId &&
      (item.organizationId = new Types.ObjectId(dto.organizationId));
    dto.category && (item.category = dto.category);
    dto.defaultPrice && (item.defaultPrice = dto.defaultPrice);
    dto.name && (item.name = dto.name);
    // dto.projectId && (item.projectId = new Types.ObjectId(dto.projectId));
    dto.totalNeed && (item.totalNeed = dto.totalNeed);
    dto.description && (item.description = dto.description);
    // dto.images && (item.images = dto.images);
    return item;
  }
}

export const ItemSchema = SchemaFactory.createForClass(Item);
