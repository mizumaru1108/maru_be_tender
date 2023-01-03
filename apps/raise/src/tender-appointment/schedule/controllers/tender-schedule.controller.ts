import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';
import { CreateScheduleDto } from '../dtos/requests/create-schedule-request.dto';
import { CreateScheduleResponseDto } from '../dtos/responses/create-schedule-response.dto';
import { GetMyScheduleResponse } from '../dtos/responses/get-my-schedule-response.dto';
import { TenderScheduleService } from '../services/tender-schedule.service';

@Controller('tender/schedules')
export class TenderScheduleController {
  constructor(private readonly tenderScheduleService: TenderScheduleService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Get('mine')
  async getMySchedules(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<BaseResponse<GetMyScheduleResponse['schedule']>> {
    const schedules = await this.tenderScheduleService.getMySchedules(
      currentUser.id,
    );
    return baseResponseHelper(
      schedules,
      HttpStatus.OK,
      'Schedule created successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('upsert-schedules')
  async upsertSchedules(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() createRequest: CreateScheduleDto,
  ): Promise<BaseResponse<CreateScheduleResponseDto>> {
    const response = await this.tenderScheduleService.upsertSchedules(
      currentUser.id,
      createRequest.payload,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Schedule created successfully',
    );
  }
}
