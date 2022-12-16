import { Controller, UseGuards, Get, HttpStatus, Query } from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderRoomChatService } from '../services/tender-room-chat.service';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';

@Controller('tender/room-chats')
export class TenderRoomChatController {
  constructor(private readonly tenderRoomChatService: TenderRoomChatService) {}

  @UseGuards(TenderJwtGuard)
  @Get('get-last-chat')
  async fetchLastChat(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() { limit = 10, page = 1 }: BaseFilterRequest,
  ): Promise<any> {
    const res = await this.tenderRoomChatService.fetchLastChat(
      currentUser.id,
      limit,
      page,
    );

    return manualPaginationHelper(
      res.data,
      res.total,
      page,
      limit,
      HttpStatus.OK,
      'Success',
    );
  }
}
