import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackModule } from './track/track.module';
import { TrackSectionModule } from './track-section/track.section.module';
import { SectionSupervisorModule } from './section-supervisor/section.supervisor.module';

const importedModule = [
  CqrsModule,
  TrackModule,
  TrackSectionModule,
  SectionSupervisorModule,
];

@Module({
  imports: [...importedModule],
})
export class TrackManagementModule {}
