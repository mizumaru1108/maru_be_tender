import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EntitiesHttpController } from './controllers/entity.controller';
import { EntitiesRepository } from './repositories/entities.repository';
import { EntitiesCreateCommandHandler } from './commands/entities.create.command/entities.create.command';

const importedModule = [CqrsModule];
const controllers = [EntitiesHttpController];
const repositories: Provider[] = [EntitiesRepository];
const commands: Provider[] = [EntitiesCreateCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class EntityModule {}
