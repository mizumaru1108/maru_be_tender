import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { GoogleAuthGuard } from '../../../tender-auth/guards/google-auth.guard';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';

import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentService } from '../services/tender-appointment.service';
import { FastifyReply } from 'fastify';

@Controller('tender-appointment')
export class TenderAppointmentController {
  constructor(
    private readonly tenderAppointmentService: TenderAppointmentService,
  ) {}

  @UseGuards(TenderJwtGuard)
  @Post('create-appointment')
  async createAppointment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateAppointmentDto,
  ) {
    const result = await this.tenderAppointmentService.createAppointment(
      request.code,
      currentUser,
    );
    return baseResponseHelper(result, HttpStatus.CREATED, 'Success');
  }

  @Post('test-service-account')
  async serviceAccount() {
    await this.tenderAppointmentService.serviceAccount();
  }

  @Get('google-callback')
  async googleCallback(@Query() query: any, @Res() res: FastifyReply) {
    console.log('query', query);
    await this.tenderAppointmentService.createAppointment(query.code);
    console.log('google callback hit');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Logining in...</title>
        </head>
        <body>
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

  @UseGuards(JwtAuthGuard)
  @Get('search-client')
  async searchClient(@Query() searchParams: SearchClientFilterRequest) {
    const result = await this.tenderAppointmentService.searchClientByName(
      searchParams,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      searchParams.page || 1,
      searchParams.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }
}
