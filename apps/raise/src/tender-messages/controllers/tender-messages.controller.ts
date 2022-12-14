import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { message } from '@prisma/client';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { CreateMessageDto } from '../dtos/requests/create-message.dto';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import { TenderMessagesService } from '../services/tender-messages.service';

@Controller('tender/messages')
export class TenderMessagesController {
  constructor(private readonly tenderMessagesService: TenderMessagesService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_admin',
    'tender_ceo',
    'tender_consultant',
    'tender_accounts_manager',
    'tender_project_supervisor',
    'tender_project_manager',
    'tender_moderator',
    'tender_finance',
    'tender_cashier',
  )
  @Post('send')
  async send(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateMessageDto,
  ): Promise<BaseResponse<message>> {
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
  async findMessages(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() filter: SearchMessageFilterRequest,
  ): Promise<any> {
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
  async fetchLastChat(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body('limit') limit: number,
    @Body('page') page: number,
  ): Promise<any> {
    const res = await this.tenderMessagesService.fetchLastChat(
      currentUser.id,
      limit,
      page,
    );

    return manualPaginationHelper(
      res.data,
      res.total,
      page || 1,
      limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }
}
