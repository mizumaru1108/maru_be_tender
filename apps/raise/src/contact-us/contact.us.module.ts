import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContactUsHttpController } from './controllers/contact.us.http.controller';
import { ContactUsCreateCommandHandler } from './commands/contact.us.create.command/contact.us.create.command';
import { ContactUsRepository } from './repositories/contact.us.repository';
import { ContactUsFindManyQueryHandler } from './queries/contact.us.find.many.query/contact.us.find.many.query';

const importedModule = [CqrsModule];
const controllers = [ContactUsHttpController];
const repositories: Provider[] = [ContactUsRepository];
const commands: Provider[] = [ContactUsCreateCommandHandler];
const queries: Provider[] = [ContactUsFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ContactUsModule {}
