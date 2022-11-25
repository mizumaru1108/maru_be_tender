import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Organization } from '../../organization/schema/organization.schema';
import { RoleEnum } from '../enums/role-enum';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @Prop({ type: String })
  _id: string;

  /**
   * to define which user belongs to which organization.
   */
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  organizationId: Types.ObjectId | Organization;

  /**
   * it's not event used at all
   * name: $exist: true, not result anything
   */
  @Prop({ required: false })
  name: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: RoleEnum, default: RoleEnum.DONOR })
  type: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
