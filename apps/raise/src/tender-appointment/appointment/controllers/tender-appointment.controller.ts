import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentService } from '../services/tender-appointment.service';

@Controller('tender-appointment')
export class TenderAppointmentController {
  constructor(
    private readonly tenderAppointmentService: TenderAppointmentService,
  ) {}

  @Post()
  create() {}

  @UseGuards(JwtAuthGuard)
  @Get('search-client')
  async searchClient(
    @Query() searchParams: SearchClientFilterRequest,
  ): Promise<ManualPaginatedResponse<any>> {
    const result = await this.tenderAppointmentService.searchClient(
      searchParams,
    );
    const totalData = await this.tenderAppointmentService.countClient(
      searchParams,
    );
    return manualPaginationHelper(
      result,
      totalData,
      searchParams.page || 1,
      searchParams.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @Get()
  findAll() {
    return this.tenderAppointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenderAppointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
