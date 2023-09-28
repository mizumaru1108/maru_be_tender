import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackSectionHttpController } from './controllers/track.section.controller';
import { TrackSectionRepository } from './repositories/track.section.repository';

const importedModule = [CqrsModule];
const controllers = [TrackSectionHttpController];
const repositories: Provider[] = [TrackSectionRepository];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [TrackSectionRepository];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class TrackSectionModule {}
