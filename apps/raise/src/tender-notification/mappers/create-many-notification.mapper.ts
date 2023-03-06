import { Prisma } from '@prisma/client';
import { CreateManyNotificationDto } from '../dtos/requests/create-many-notification.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateNotificationDto } from '../dtos/requests/create-notification.dto';

export const createManyNotificationMapper = (
  request: CreateManyNotificationDto,
): Prisma.notificationCreateManyInput[] => {
  return request.payloads.map((payload: CreateNotificationDto) => {
    const notification: Prisma.notificationCreateManyInput = {
      id: uuidv4(),
      user_id: payload.user_id,
      content: payload.content,
      subject: payload.subject,
      type: payload.type,
      message_id: payload.message_id || null,
      appointment_id: payload.appointment_id || null,
      proposal_id: payload.proposal_id || null,
    };

    if (payload.specific_type) {
      notification.specific_type = payload.specific_type;
    }
    return notification;
  });
};
