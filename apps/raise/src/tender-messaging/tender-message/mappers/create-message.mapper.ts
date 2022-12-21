import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageDto } from '../dtos/requests/create-message.dto';

export const createMessageMapper = (
  senderId: string,
  roomChatId: string,
  request: CreateMessageDto,
): Prisma.messageCreateInput => {
  const {
    content_type_id: contentType,
    content,
    content_title,
    reply_id,
    partner_id,
    partner_selected_role,
    current_user_selected_role,
  } = request;

  const createMessagePaylaod: Prisma.messageCreateInput = {
    id: uuidv4(),
    content_type: {
      connect: {
        id: contentType,
      },
    },
    sender: {
      connect: {
        id: senderId,
      },
    },
    sender_role_as: current_user_selected_role,
    receiver: {
      connect: {
        id: partner_id,
      },
    },
    receiver_role_as: partner_selected_role,
    room_chat: {
      connect: {
        id: roomChatId,
      },
    },
  };

  if (contentType === 'TEXT') {
    createMessagePaylaod.content = content;
  }

  if (content_title) createMessagePaylaod.content_title = content_title;

  if (reply_id) createMessagePaylaod.reply_id = reply_id;

  return createMessagePaylaod;
};
