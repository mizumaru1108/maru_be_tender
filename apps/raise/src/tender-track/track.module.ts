import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrackCreateCommandCommandHandler } from './track/commands/track.create.command/track.create.command';
import { TrackUpdateCommandHandler } from './track/commands/track.update.command/track.update.command';
import { TrackController } from './track/controllers/track.controller';
import { TrackFindManyQueryHandler } from './track/queries/track.find.many/track.find.many.query';
import { TrackRepository } from './track/repositories/track.repository';

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
