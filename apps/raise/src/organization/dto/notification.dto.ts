import { Types } from 'mongoose';

export class NotificationDto {
  id: string;
  organizationId: Types.ObjectId;
  type: string;
  title: string;
  body: string;
  icon: string;
  markAsRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
