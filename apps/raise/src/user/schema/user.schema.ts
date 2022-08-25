import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../enums/role-enum';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User {
  @Prop({ type: String })
  _id: string;

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
