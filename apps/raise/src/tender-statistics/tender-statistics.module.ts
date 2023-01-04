import { Module } from '@nestjs/common';
import { TenderStatisticsController } from './controllers/tender-statistics.controller';
import { TenderStatisticsRepository } from './repositories/tender-statistic.repository';
import { TenderStatisticsService } from './services/tender-statistics.service';

@Module({
  controllers: [TenderStatisticsController],
  providers: [TenderStatisticsService, TenderStatisticsRepository],
  exports: [TenderStatisticsService, TenderStatisticsRepository],
})
export class TenderStatisticsModule {}
