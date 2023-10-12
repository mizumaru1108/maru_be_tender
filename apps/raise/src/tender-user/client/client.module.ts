import { Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { TenderClientController } from './controllers/tender-client.controller';
import { ClientFindNameAndIdQueryHandler } from './queries/client.find.name.and.id/client.find.name.and.id.query';
import { TenderClientRepository } from './repositories/tender-client.repository';
import { TenderClientService } from './services/tender-client.service';
import { ClientCreateEditRequestCommandHandler } from './commands/client.create.edit.request/client.create.edit.request.command';
import { EditRequestModule } from '../edit-requests/edit.request.module';
import { ClientApproveEditRequestCommandHandler } from './commands/client.approve.edit.request/client.approve.edit.request.command';
import { BankInformationModule } from '../../bank/bank.module';

const importedModule = [
  CqrsModule,
  forwardRef(() => UserModule),
  EditRequestModule,
  BankInformationModule,
];
const controllers = [TenderClientController];
const repositories: Provider[] = [TenderClientRepository];
const commands: Provider[] = [
  // Client Domain
  TenderClientService,
  ClientCreateEditRequestCommandHandler,
  ClientApproveEditRequestCommandHandler,
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
