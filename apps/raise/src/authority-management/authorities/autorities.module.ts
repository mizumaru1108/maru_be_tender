import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthoritiesHttpController } from './controllers/authorities.http.controller';
import { AuthoritiesRepository } from './repositories/authorities.repository';
import { AuthoritiesCreateCommandHandler } from './commands/authorities.create.command/authorities.create.command';
import { AuthoritiesFindManyQueryHandler } from './queries/authorities.find.many.query/authorities.find.many.query';
import { AuthoritiesUpdateCommandHandler } from './commands/authorities.update.command/authorities.update.command';
import { AuthoritiesDeleteCommandHandler } from './commands/authorities.delete.command/authorities.delete.command';

const importedModule = [CqrsModule];
const controllers = [AuthoritiesHttpController];
const repositories: Provider[] = [AuthoritiesRepository];
const commands: Provider[] = [
  AuthoritiesCreateCommandHandler,
  AuthoritiesUpdateCommandHandler,
  AuthoritiesDeleteCommandHandler,
];
const queries: Provider[] = [AuthoritiesFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class AuthoritiesModule {}
