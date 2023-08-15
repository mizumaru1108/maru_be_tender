import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientFieldHttpController } from './controllers/client.field.controller';
import { ClientFieldRepository } from './repositories/client.field.repository';
import { ClientFieldCreateCommandHandler } from './commands/client.field.create.command/client.field.create.command';
import { ClientFieldFindManyQueryHandler } from './queries/client.field.find.many.query.ts/client.field.find.many.query';

const importedModule = [CqrsModule];
const controllers = [ClientFieldHttpController];
const repositories: Provider[] = [ClientFieldRepository];
const commands: Provider[] = [ClientFieldCreateCommandHandler];
const queries: Provider[] = [ClientFieldFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ClientFieldModule {}
