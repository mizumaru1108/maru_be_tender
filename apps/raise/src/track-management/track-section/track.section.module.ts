import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackSectionHttpController } from './controllers/track.section.controller';
import { TrackSectionRepository } from './repositories/track.section.repository';
import { TrackSectionSaveCommandHandler } from './commands/track.section.create/track.section.create.command';
import { TrackSectionMapper } from './mapper/track.section.mapper';
import { TrackSectionFindByIdQueryHandler } from './queries/track.section.find.by.id.query';
import { SectionSupervisorModule } from '../section-supervisor/section.supervisor.module';

const importedModule = [CqrsModule, SectionSupervisorModule];
const controllers = [TrackSectionHttpController];
const repositories: Provider[] = [TrackSectionRepository];
const commands: Provider[] = [TrackSectionSaveCommandHandler];
const queries: Provider[] = [TrackSectionFindByIdQueryHandler];
const exportedProviders: Provider[] = [TrackSectionRepository];
const mapper: Provider[] = [TrackSectionMapper];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...mapper, ...queries],
  exports: [...exportedProviders],
})
export class TrackSectionModule {}
