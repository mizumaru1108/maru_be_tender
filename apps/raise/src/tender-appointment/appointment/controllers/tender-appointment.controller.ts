import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { GoogleAuthGuard } from '../../../tender-auth/guards/google-auth.guard';

import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentService } from '../services/tender-appointment.service';

@Controller('tender-appointment')
export class TenderAppointmentController {
  constructor(
    private readonly tenderAppointmentService: TenderAppointmentService,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Post('testing-google')
  async testingAuth() {
    console.log('testing auth');
  }

  @Post('create-appointment')
  async oauthTest(@Body('code') code?: string) {
    const appointmentLink =
      await this.tenderAppointmentService.createAppointment(code);
    return appointmentLink;
  }

  @Post('test-service-account')
  async serviceAccount() {
    await this.tenderAppointmentService.serviceAccount();
  }

  @Get('google-callback')
  async googleCallback(@Query() query: any) {
    console.log('query', query);
    await this.tenderAppointmentService.createAppointment(query.code);
    console.log('google callback hit');
    // return 'google callback hit';
    // return auto close the opened window
    return `
      <script>
        window.close();
      </script>
    `;
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
