import { Injectable } from '@nestjs/common';
import { CreateRoomChatDto } from '../dtos/requests/create-room-chat.dto';
import { TenderRoomChatRepository } from '../repositories/tender-room-chat.repository';
import dayjs from 'dayjs';
import { CreateRoomChatResponseDto } from '../dtos/responses/create-room-chat-response.dto';

@Injectable()
export class TenderRoomChatService {
  constructor(
    private readonly tenderRoomChatRepository: TenderRoomChatRepository,
  ) {}

  async createRoomChat(
    userId: string,
    request: CreateRoomChatDto,
  ): Promise<CreateRoomChatResponseDto> {
    const existingRoomChat =
      await this.tenderRoomChatRepository.findOurRoomChat(
        userId,
        request.partner_id,
      );
    if (existingRoomChat) {
      return {
        logs: `RoomChat Already Exist, created at ${dayjs(
          existingRoomChat.created_at,
        ).format('DD-MM-YYYY HH:mm A')}`,
        room_chat: existingRoomChat,
      };
    }

    const createdRoom = await this.tenderRoomChatRepository.createRoomChat(
      userId,
      request.partner_id,
      request.correspondance_type,
    );
    return {
      logs: `RoomChat Created Successfully, created at ${dayjs(
        createdRoom.created_at,
      ).format('DD-MM-YYYY HH:mm A')}`,
      room_chat: createdRoom,
    };
  }

  async fetchLastChat(userId: string, limit: number, page: number) {
    const response = await this.tenderRoomChatRepository.fetchLastChat(
      userId,
      limit,
      page,
    );
    return response;
  }
}
