import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Campaign } from '../../campaign/schema/campaign.schema';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Project } from '../../project/project.schema';
import { User } from '@authzed/authzed-node/dist/src/v0';
import { Item } from '../../item/item.schema';
import { BaseBooleanString } from '../../commons/enums/base-boolean-string.enum';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true, // will created CreatedAt and UpdatedAt fields automatically
  toJSON: { virtuals: true }, // for populate virtual fields
  toObject: { virtuals: true }, // for populate virtual fields
  id: false, // disable id field on populated virtual fields so it won't be displayed in response (doubled)
})
export class Comment {
  readonly _id?: string | Types.ObjectId;

  /**
   * Content of the comment, it can be raw text or raw text combined with markdown.
   */
  @Prop({ required: true })
  content: string;

  /**
   * the author of the comment.
   */
  @Prop({ required: true, ref: 'user' })
  commentOwnerId: string;

  /**
   * virtual props (populated), just for accessing purposes. Not stored in the database.
   * so we don't need to use @Prop() decorator.
   * @example Comment.projectDetails
   */
  commentOwnerDetails: User;

  /**
   * Refrence to the campaign this comment belongs to.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'campaign', default: null })
  campaignId: Types.ObjectId | Campaign;

  /**
   * virtual props (populated), just for accessing purposes. Not stored in the database.
   * so we don't need to use @Prop() decorator.
   * @example Comment.campaignDetails.campaignName / Comment.campaignDetails.title
   */
  campaignDetails?: Campaign;

  /**
   * Refrence to the project this comment belongs to.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'project', default: null })
  projectId: Types.ObjectId | Project;

  projectDetails?: Project;

  /**
   * Refrence to the Item this comment belongs to. (just in case user can comment on the item)
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'item', default: null })
  itemId: Types.ObjectId | Item;

  itemDetails?: Item;

  /**
   * Refrence to the parent comment.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'comments', default: null })
  parentCommentId: Types.ObjectId | Comment;

  parentCommentDetails?: Comment;

  allReply?: Comment[];

  /**
   * Soft Delete
   */
  @Prop({ enum: BaseBooleanString, default: BaseBooleanString.N })
  isDeleted: BaseBooleanString;

  /**
   * Soft Delete Date
   */
  @Prop({ default: null })
  deletedDate: Date;

  /**
   * i don't use props decorator here, it's just for accessing the auto created fields
   * @example Comment.createdAt
   */
  public createdAt?: Date;

  public updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
  .plugin(paginate)
  .plugin(aggregatePaginate);
