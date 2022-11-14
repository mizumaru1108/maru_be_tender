import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { email_record } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { EmailFilterRequest } from '../dtos/requests/email-filter-request.dto';
import { SendNewEmailDto } from '../dtos/requests/send-new-email.dto';
import { TenderEmailService } from '../services/tender-email.service';

@Controller('tender-email')
export class TenderEmailController {
  constructor(private readonly tenderEmailService: TenderEmailService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async send(
    @CurrentUser() user: ICurrentUser,
    @Body() request: SendNewEmailDto,
  ): Promise<BaseResponse<email_record>> {
    const createdRecord = await this.tenderEmailService.send(user.id, request);
    return baseResponseHelper(
      createdRecord,
      HttpStatus.CREATED,
      'Tender Email sent successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-inbox')
  async myInbox(
    @CurrentUser() user: ICurrentUser,
    @Query() searchParams: EmailFilterRequest,
  ) {
    const createdRecord = await this.tenderEmailService.getMyInbox(
      user.id,
      searchParams,
    );
    return manualPaginationHelper(
      createdRecord.data,
      createdRecord.total,
      searchParams.page || 1,
      searchParams.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-outbox')
  async myOutbox(
    @CurrentUser() user: ICurrentUser,
    @Query() searchParams: EmailFilterRequest,
  ) {
    const createdRecord = await this.tenderEmailService.getMyOutbox(
      user.id,
      searchParams,
    );
    return manualPaginationHelper(
      createdRecord.data,
      createdRecord.total,
      searchParams.page || 1,
      searchParams.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }
}
