import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationsDocument = Notifications & Document;

@Schema({ collection: 'notifications' })
export class Notifications {
  @Prop()
  id: string;
  @Prop({
    type: Types.ObjectId,
    default: null,
  })
  organizationId: Types.ObjectId | null;
  @Prop()
  type: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  title: string;
  @Prop()
  body: string;
  @Prop()
  icon: string;
  @Prop()
  markAsRead: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
