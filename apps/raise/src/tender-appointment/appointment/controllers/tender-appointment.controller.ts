import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';

import { appointment } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { AppointmentFilterRequest } from '../dtos/requests/appointment-filter-request.dto';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { InvitationResponseDto } from '../dtos/requests/response-invitation.dto';
import { TenderAppointmentService } from '../services/tender-appointment.service';
import { GoogleOAuth2CalendarGuard } from '../../../tender-auth/guards/google-calendar-auth.guard';

@Controller('tender/appointments')
export class TenderAppointmentController {
  constructor(
    private readonly tenderAppointmentService: TenderAppointmentService,
  ) {}

  @UseGuards(TenderJwtGuard, GoogleOAuth2CalendarGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('create-appointment')
  async createAppointment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateAppointmentDto,
  ): Promise<BaseResponse<appointment>> {
    const result = await this.tenderAppointmentService.createAppointment(
      currentUser,
      request,
    );
    return baseResponseHelper(result, HttpStatus.CREATED, 'Success');
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Patch('response-invitation')
  async responseInvitation(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: InvitationResponseDto,
  ): Promise<BaseResponse<appointment>> {
    const result = await this.tenderAppointmentService.responseInvitation(
      currentUser,
      request,
    );
    return baseResponseHelper(result, HttpStatus.CREATED, 'Success');
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor', 'tender_client')
  @Get('mine')
  async getMyAppointments(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: AppointmentFilterRequest,
  ) {
    const result = await this.tenderAppointmentService.getMyAppointment(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Get('fetch')
  async fetchAppointment(@Query() filter: AppointmentFilterRequest) {
    console.log({ filter });
    const result = await this.tenderAppointmentService.fetchAppointments(
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @Get('google-callback')
  async googleCallback(@Query() query: any, @Res() res: FastifyReply) {
    console.log('query', query);
    // TODO: HOW TO IDENTIFY THE USER ?? if the user email is not same as the email in the APP?
    // await this.tenderAppointmentService.createAppointmentOld(query.code);
    console.log('google callback hit');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Logining in...</title>
        </head>
        <body>
          query: ${JSON.stringify(query.code)}
          your google account has been linked to tender app, you can close this
          <script>
            window.close();
        </script>
        </body>
      </html>
    `;

    res.header('Content-Type', 'text/html').code(200);
    res.send(html);
  }
}
