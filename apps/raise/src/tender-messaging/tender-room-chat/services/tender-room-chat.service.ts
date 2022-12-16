import { Injectable } from '@nestjs/common';
import { TenderRoomChatRepository } from '../repositories/tender-room-chat.repository';

@Injectable()
export class TenderRoomChatService {
  constructor(
    private readonly tenderRoomsRepository: TenderRoomChatRepository,
  ) {}

  async fetchLastChat(userId: string, limit: number, page: number) {
    const response = await this.tenderRoomsRepository.fetchLastChat(
      userId,
      limit,
      page,
    );
    return response;
  }
}
