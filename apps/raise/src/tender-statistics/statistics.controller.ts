import {
  Controller,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { TenderStatisticsService } from './statistics.service';

@Controller('statistcs')
export class TenderStatisticsController {
  constructor(private readonly tenderStatisticsService: TenderStatisticsService) {}

  @Get('all')
  async getAllStatistcs() {
    const allStatistics = await this.tenderStatisticsService.getAllStatistics();
    return baseResponseHelper(
      allStatistics,
      HttpStatus.OK,
      'Tender Statistics',
    );
  }
}
