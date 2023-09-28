import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackModule } from './track/track.module';
import { TrackSectionModule } from './track-section/track.section.module';

const importedModule = [CqrsModule, TrackModule, TrackSectionModule];

@Module({
  imports: [...importedModule],
})
export class TrackManagementModule {}
