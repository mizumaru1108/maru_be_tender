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
    // attachment,
    content_title,
    reply_id,
  } = request;

  const createMessagePaylaod: Prisma.messageCreateInput = {
    id: uuidv4(),
    content_type: {
      connect: {
        id: contentType,
      },
    },
    user: {
      connect: {
        id: senderId,
      },
    },
    room_chat: {
      connect: {
        id: roomChatId,
      },
    },
  };

  if (contentType === 'TEXT') {
    createMessagePaylaod.content = content;
  }
  //  else {
  //   createMessagePaylaod.attachment = attachment as
  //     | Prisma.InputJsonValue
  //     | undefined;
  // }

  if (content_title) createMessagePaylaod.content_title = content_title;

  if (reply_id) createMessagePaylaod.reply_id = reply_id;

  return createMessagePaylaod;
};
