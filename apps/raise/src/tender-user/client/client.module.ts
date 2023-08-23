import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { TenderClientController } from './controllers/tender-client.controller';
import { TenderClientRepository } from './repositories/tender-client.repository';
import { TenderClientService } from './services/tender-client.service';

const importedModule = [CqrsModule, UserModule];
const controllers = [TenderClientController];
const repositories: Provider[] = [TenderClientRepository];
const commands: Provider[] = [
  // Client Domain
  TenderClientService,
];
const queries: Provider[] = [];
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
