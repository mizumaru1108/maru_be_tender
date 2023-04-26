import { Module } from '@nestjs/common';
import { TenderTrackController } from './controllers/tender-track.controller';
import { TenderTrackService } from './services/tender-track.service';
import { TenderTrackRepository } from './repositories/tender-track.repository';

@Module({
  controllers: [TenderTrackController],
  providers: [TenderTrackService, TenderTrackRepository],
  exports: [TenderTrackService, TenderTrackRepository],
})
export class TenderTrackModule {}
