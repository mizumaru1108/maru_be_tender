import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthoritiesHttpController } from './controllers/authorities.http.controller';
import { AuthoritiesRepository } from './repositories/authorities.repository';
import { AuthoritiesCreateCommandHandler } from './commands/authorities.create.command/authorities.create.command';
import { AuthoritiesFindManyQueryHandler } from './queries/authorities.find.many.query/authorities.find.many.query';

const importedModule = [CqrsModule];
const controllers = [AuthoritiesHttpController];
const repositories: Provider[] = [AuthoritiesRepository];
const commands: Provider[] = [AuthoritiesCreateCommandHandler];
const queries: Provider[] = [AuthoritiesFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class AuthoritiesModule {}
