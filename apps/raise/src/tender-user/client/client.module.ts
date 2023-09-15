import { Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { TenderClientController } from './controllers/tender-client.controller';
import { ClientFindNameAndIdQueryHandler } from './queries/client.find.name.and.id/client.find.name.and.id.query';
import { TenderClientRepository } from './repositories/tender-client.repository';
import { TenderClientService } from './services/tender-client.service';

const importedModule = [CqrsModule, forwardRef(() => UserModule)];
const controllers = [TenderClientController];
const repositories: Provider[] = [TenderClientRepository];
const commands: Provider[] = [
  // Client Domain
  TenderClientService,
];
const queries: Provider[] = [ClientFindNameAndIdQueryHandler];
const exportedProviders: Provider[] = [
  TenderClientService,
  TenderClientRepository,
];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ClientModule {}
