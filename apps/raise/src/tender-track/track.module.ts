import { Module } from '@nestjs/common';
import { TrackController } from './track/controllers/track.controller';
import { TrackService } from './track/services/track.service';
import { TrackRepository } from './track/repositories/track.repository';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackService, TrackRepository],
})
export class TenderTrackModule {}
