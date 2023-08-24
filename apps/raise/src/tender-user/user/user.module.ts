import { Module } from '@nestjs/common';

import { Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TenderUserController } from './controllers/tender-user.controller';
import { TenderUserRoleRepository } from './repositories/tender-user-role.repository';
import { TenderUserStatusLogRepository } from './repositories/tender-user-status-log.repository';
import { TenderUserRepository } from './repositories/tender-user.repository';
import { TenderUserService } from './services/tender-user.service';
import { UserUpdateStatusCommandHandler } from './commands/user.update.status/user.update.status.command';

const importedModule = [CqrsModule];
const controllers = [TenderUserController];
const repositories: Provider[] = [];
const commands: Provider[] = [
  // User Domain
  TenderUserService,
  UserUpdateStatusCommandHandler,
  TenderUserRepository,
  // Role Repository
  TenderUserRoleRepository,
  // user status log
  TenderUserStatusLogRepository,
];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [
  // User Domain
  TenderUserService,
  TenderUserRepository,
  // Role Repository
  TenderUserRoleRepository,
  // user status log
  TenderUserStatusLogRepository,
];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class UserModule {}