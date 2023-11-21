import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SmsConfigCreateCommandHandler } from './commands/sms.config.create.command/sms.config.create.command';
import { SmsConfigUpdateCommandHandler } from './commands/sms.config.update.command/sms.config.update.command';
import { SmsConfigHttpController } from './controllers/sms.gateway.http.controller';
import { SmsConfigRepository } from './repositories/sms.config.repository';
import { SmsConfigFindManyQueryHandler } from './queries/sms.config.find.many.query/sms.config.find.many.query';
import { SmsConfigDeleteCommandHandler } from './commands/sms.config.delete.command/sms.config.delete.command';
import { SmsConfigFindByIdQueryHandler } from './queries/sms.config.find.by.id.query/sms.config.find.by.id.query';

const importedModule = [CqrsModule];
const controllers = [SmsConfigHttpController];
const repositories: Provider[] = [SmsConfigRepository];
const commands: Provider[] = [
  SmsConfigCreateCommandHandler,
  SmsConfigUpdateCommandHandler,
  SmsConfigDeleteCommandHandler,
];
const queries: Provider[] = [
  SmsConfigFindManyQueryHandler,
  SmsConfigFindByIdQueryHandler,
];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class SmsConfigModule {}
