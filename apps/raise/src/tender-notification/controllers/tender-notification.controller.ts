import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { ReadNotificationDto } from '../dtos/requests/read-notification.dto';
import { TenderNotificationService } from '../services/tender-notification.service';

@Controller('tender/notification')
export class TenderNotificationController {
  constructor(
    private readonly tenderNotificationService: TenderNotificationService,
  ) {}

  @UseGuards(TenderJwtGuard)
  @Patch('read')
  read(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ReadNotificationDto,
  ) {
    const readResponse = this.tenderNotificationService.read(
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
  readAll(@CurrentUser() currentUser: TenderCurrentUser) {
    const readResponse = this.tenderNotificationService.readMine(
      currentUser.id,
    );

    return baseResponseHelper(
      readResponse,
      HttpStatus.OK,
      'All my notifications read successfully',
    );
  }
}
