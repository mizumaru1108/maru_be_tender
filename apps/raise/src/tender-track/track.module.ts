import { Module } from '@nestjs/common';
import { TenderTrackController } from './track.controller';
import { TenderTrackRepository } from './track.repository';
import { TenderTrackService } from './track.service';

@Module({
  controllers: [TenderTrackController],
  providers: [TenderTrackService, TenderTrackRepository],
  exports: [TenderTrackService],
})
export class TenderTrackModule {}
