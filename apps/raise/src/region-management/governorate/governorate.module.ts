import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GovernorateCreateCommandHandler } from './commands/governorate.create.command/governorate.create.command';
import { GovernorateDeleteCommandHandler } from './commands/governorate.delete.command/governorate.delete.command';
import { GovernorateUpdateCommandHandler } from './commands/governorate.update.command/governorate.update.command';
import { GovernorateHttpController } from './controllers/governorate.http.controller';
import { GovernorateFindManyQueryHandler } from './queries/governorate.find.many.query/governorate.find.many.query';
import { GovernorateRepository } from './repositories/governorate.repository';

const importedModule = [CqrsModule];
const controllers = [GovernorateHttpController];
const repositories: Provider[] = [GovernorateRepository];
const commands: Provider[] = [
  GovernorateCreateCommandHandler,
  GovernorateUpdateCommandHandler,
  GovernorateDeleteCommandHandler,
];
const queries: Provider[] = [GovernorateFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class GovernorateModule {}
