import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { SearchClientAppointmentResponseDto } from '../dtos/responses/search-client-appointment-response.dto';
import { TenderAppointmentService } from '../services/tender-appointment.service';

@Controller('tender-appointment')
export class TenderAppointmentController {
  constructor(
    private readonly tenderAppointmentService: TenderAppointmentService,
  ) {}

  @Post('test-oauth')
  async oauthTest() {
    await this.tenderAppointmentService.oauth();
  }

  @Post('test-service-account')
  async serviceAccount() {
    await this.tenderAppointmentService.serviceAccount();
  }

  @Get('google-callback')
  async googleCallback(@Body() body: any, @Req() req: any) {
    console.log('req', req);
    console.log('body', body);
    console.log('google callback hit');
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
