import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { BaseNotificationDto } from '../dtos/requests/base-notification.dto';

import { TenderNotificationService } from '../services/tender-notification.service';
import { ReadAndDeleteMineDto } from '../dtos/requests/read.and.delete.mine.dto';

@Controller('tender/notification')
export class TenderNotificationController {
  constructor(
    private readonly tenderNotificationService: TenderNotificationService,
  ) {}

  @UseGuards(TenderJwtGuard)
  @Patch('read')
  async read(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: BaseNotificationDto,
  ) {
    const readResponse = await this.tenderNotificationService.read(
      currentUser.id,
      request.notificationId,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'Notification read successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('read-mine')
  async readAll(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: ReadAndDeleteMineDto,
  ) {
    const readResponse = await this.tenderNotificationService.readMine(
      currentUser.id,
      dto.type,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'All my notifications read successfully',
    );
  }

  /* DEPRECATED FOR NOW */
  @UseGuards(TenderJwtGuard)
  @Patch('hide')
  async hide(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: BaseNotificationDto,
  ) {
    const readResponse = await this.tenderNotificationService.hide(
      currentUser.id,
      request.notificationId,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'Notification read successfully',
    );
  }

  /* DEPRECATED FOR NOW */
  @UseGuards(TenderJwtGuard)
  @Patch('hide-all-mine')
  async hideAllMine(@CurrentUser() currentUser: TenderCurrentUser) {
    const readResponse = await this.tenderNotificationService.hideAllMine(
      currentUser.id,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'All my notifications read successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('delete')
  async delete(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: BaseNotificationDto,
  ) {
    const readResponse = await this.tenderNotificationService.delete(
      currentUser.id,
      request.notificationId,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'Notification read successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('delete-all-mine')
  async deleteAllMine(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: ReadAndDeleteMineDto,
  ) {
    const readResponse = await this.tenderNotificationService.deleteAllMine(
      currentUser.id,
      dto.type,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'All my notifications read successfully',
    );
  }
}
