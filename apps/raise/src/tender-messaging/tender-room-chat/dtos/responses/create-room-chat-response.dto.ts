import { room_chat } from '@prisma/client';

export class CreateRoomChatResponseDto {
  logs: string;
  room_chat: room_chat;
}
