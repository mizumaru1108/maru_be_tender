import { Prisma } from '@prisma/client';
import { CreateNotificationDto } from '../dtos/requests/create-notification.dto';
import { v4 as uuidv4 } from 'uuid';

export const createNotificationMapper = (
  request: CreateNotificationDto,
): Prisma.notificationCreateInput => {
  const createNotificationPayload: Prisma.notificationCreateInput = {
    id: uuidv4(),
    user: {
      connect: {
        id: request.user_id,
      },
    },
    content: request.content,
    subject: request.subject,
    type: request.type,
  };
  if (request.message_id) {
    createNotificationPayload.message = {
      connect: {
        id: request.message_id,
      },
    };
  }
  if (request.proposal_id) {
    createNotificationPayload.proposal = {
      connect: {
        id: request.proposal_id,
      },
    };
  }
  if (request.appointment_id) {
    createNotificationPayload.appointment = {
      connect: {
        id: request.appointment_id,
      },
    };
  }
  return createNotificationPayload;
};
