import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackCreateCommandCommandHandler } from './commands/track.create.command/track.create.command';
import { TrackUpdateCommandHandler } from './commands/track.update.command/track.update.command';
import { TrackController } from './controllers/track.controller';
import { TrackFindManyQueryHandler } from './queries/track.find.many/track.find.many.query';
import { TrackRepository } from './repositories/track.repository';

const importedModule = [CqrsModule];
const controllers = [TrackController];
const repositories: Provider[] = [TrackRepository];
const commands: Provider[] = [
  TrackCreateCommandCommandHandler,
  TrackUpdateCommandHandler,
];
const queries: Provider[] = [TrackFindManyQueryHandler];
const exportedProviders: Provider[] = [...repositories];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class TrackModule {}
