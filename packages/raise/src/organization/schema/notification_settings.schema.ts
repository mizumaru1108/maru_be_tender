import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationSettingsDocument = NotificationSettings & Document;

@Schema({ collection: 'notification_settings' })
export class NotificationSettings {
  @Prop()
  id: string;
  @Prop()
  organizationId: string;
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
