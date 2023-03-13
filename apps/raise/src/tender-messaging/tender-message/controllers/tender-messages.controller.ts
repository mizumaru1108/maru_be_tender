import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CreateMessageDto } from '../dtos/requests/create-message.dto';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import { ToogleReadMessageDto } from '../dtos/requests/toogle-read-message.dto';
import { IIncomingMessageSummary } from '../interfaces/incomming-message';
import { TenderMessagesService } from '../services/tender-messages.service';

@Controller('tender/messages')
export class TenderMessagesController {
  constructor(private readonly tenderMessagesService: TenderMessagesService) {}

  @UseGuards(TenderJwtGuard)
  @Post('send')
  async send(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateMessageDto,
  ): Promise<BaseResponse<IIncomingMessageSummary>> {
    const res = await this.tenderMessagesService.send(
      currentUser.id,
      currentUser.choosenRole,
      request,
    );
    return baseResponseHelper(
      res,
      HttpStatus.CREATED,
      'Message sent successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('find')
  async findMessages(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: SearchMessageFilterRequest,
  ): Promise<ManualPaginatedResponse<any>> {
    const res = await this.tenderMessagesService.findMessages(
      currentUser.id,
      filter,
    );

    return manualPaginationHelper(
      res.data,
      res.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('toogle-read')
  async toogleRead(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ToogleReadMessageDto,
  ): Promise<BaseResponse<string>> {
    const res = await this.tenderMessagesService.readAllMessageByRoomId(
      currentUser.id,
      request.roomId,
    );
    return baseResponseHelper(
      `${res} messages marked as read!`,
      HttpStatus.CREATED,
      'All messages in this room marked as read!',
    );
  }
}
