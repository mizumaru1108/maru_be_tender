import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationSettingsDocument = NotificationSettings & Document;

@Schema({ collection: 'notification_settings' })
export class NotificationSettings {
  @Prop()
  id: string;
  @Prop()
  organizationId: Types.ObjectId;
  @Prop()
  showNotif: boolean;
  @Prop()
  allowSound: boolean;
  @Prop()
  newDonation: boolean;
  @Prop()
  completeDonation: boolean;
  @Prop()
  emailNotif: boolean;
}

export const NotificationSettingsSchema =
  SchemaFactory.createForClass(NotificationSettings);
