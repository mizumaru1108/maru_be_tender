import { Module } from '@nestjs/common';
import { TenderTrackController } from './track/controllers/tender-track.controller';
import { TenderTrackService } from './track/services/tender-track.service';
import { TenderTrackRepository } from './track/repositories/tender-track.repository';

@Module({
  controllers: [TenderTrackController],
  providers: [TenderTrackService, TenderTrackRepository],
  exports: [TenderTrackService, TenderTrackRepository],
})
export class TenderTrackModule {}
