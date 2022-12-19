import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { room_chat } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CreateRoomChatDto } from '../dtos/requests/create-room-chat.dto';
import { CreateRoomChatResponseDto } from '../dtos/responses/create-room-chat-response.dto';
import { TenderRoomChatService } from '../services/tender-room-chat.service';

@Controller('tender/room-chats')
export class TenderRoomChatController {
  constructor(private readonly tenderRoomChatService: TenderRoomChatService) {}

  @UseGuards(TenderJwtGuard)
  @Post('create')
  async createRoomChat(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateRoomChatDto,
  ): Promise<BaseResponse<CreateRoomChatResponseDto>> {
    const res = await this.tenderRoomChatService.createRoomChat(
      currentUser.id,
      request,
    );

    return baseResponseHelper(
      res,
      HttpStatus.CREATED,
      'RoomChat Created Successfully',
    );
  }

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
