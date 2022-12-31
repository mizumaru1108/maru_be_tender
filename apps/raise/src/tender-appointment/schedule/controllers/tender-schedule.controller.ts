import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';
import { EditScheduleRequestDto } from '../dtos/requests/edit-schedule-request.dto';
import { EditScheduleResponse } from '../dtos/responses/edit-schedule-response.dto';
import { TenderScheduleService } from '../services/tender-schedule.service';

@Controller('tender/schedule')
export class TenderScheduleController {
  constructor(private readonly tenderScheduleService: TenderScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('edit')
  async edit(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() editRequests: EditScheduleRequestDto,
  ): Promise<BaseResponse<EditScheduleResponse>> {
    const response = await this.tenderScheduleService.edit(
      currentUser.id,
      editRequests,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Schedule edited successfully',
    );
  }

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
