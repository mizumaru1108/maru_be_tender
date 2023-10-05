import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailRecordCreateCommandHandler } from './commands/email.record.create.command/email.record.create.command';
import { EmailRecordHttpController } from './controllers/email.record.http.controller';
import { EmailRecordFindByIdQueryHandler } from './queries/email.record.find.by.id/email.record.find.by.id.query';
import { EmailRecordFindManyQueryHandler } from './queries/email.record.find.many/email.record.find.many.query';
import { EmailRecordRepository } from './repositories/email.record.repository';

const importedModule = [CqrsModule];
const controllers = [EmailRecordHttpController];
const repositories: Provider[] = [EmailRecordRepository];
const commands: Provider[] = [EmailRecordCreateCommandHandler];
const queries: Provider[] = [
  EmailRecordFindManyQueryHandler,
  EmailRecordFindByIdQueryHandler,
];

const exportedProviders: Provider[] = [...repositories];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class EmailRecordModule {}
