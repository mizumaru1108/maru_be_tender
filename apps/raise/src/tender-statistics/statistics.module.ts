import { Module } from '@nestjs/common';
import { TenderStatisticsController } from './statistics.controller';
import { TenderStatisticsService } from './statistics.service';

@Module({
  controllers: [TenderStatisticsController],
  providers: [TenderStatisticsService, ],
  exports: [TenderStatisticsService],
})
export class TenderStatisticsModule {}
