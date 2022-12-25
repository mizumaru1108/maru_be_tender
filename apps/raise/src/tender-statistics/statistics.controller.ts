import {
  Controller,
  Get,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { TenderStatisticsService } from './statistics.service';

@Controller('statistcs')
export class TenderStatisticsController {
  constructor(private readonly tenderStatisticsService: TenderStatisticsService) {}

  @Get('all')
  async getAllStatistics(@Query() query: any) {
    const { from, to } = query;
    const allStatistics = await this.tenderStatisticsService.getAllStatistics(new Date(from), new Date(to));
    return baseResponseHelper(
      allStatistics,
      HttpStatus.OK,
      'Tender Statistics',
    );
  }

  @Get('partners')
  async getAllPartnersStatistics(@Query() query: any) {
    const { from, to } = query;
    const allParntersStatistics = await this.tenderStatisticsService.getAllParntersStatistics(new Date(from), new Date(to));
    return baseResponseHelper(
      allParntersStatistics,
      HttpStatus.OK,
      'Tender Statistics',
    );
  }
}
