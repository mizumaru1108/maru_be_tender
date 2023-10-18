import { Module, forwardRef } from '@nestjs/common';

import { Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientModule } from '../client/client.module';
import { UserCreateCommandHandler } from './commands/user.create/user.create.command';
import { UserSoftDeleteCommandHandler } from './commands/user.soft.delete/user.soft.delete.command';
import { UserUpdateProfileCommandHandler } from './commands/user.update.profile/user.update.profile.command';
import { UserUpdateStatusCommandHandler } from './commands/user.update.status/user.update.status.command';
import { UserUpdateCommandHandler } from './commands/user.update/user.update.command';
import { TenderUserController } from './controllers/tender-user.controller';
import { TenderUserRoleRepository } from './repositories/tender-user-role.repository';
import { TenderUserStatusLogRepository } from './repositories/tender-user-status-log.repository';
import { TenderUserRepository } from './repositories/tender-user.repository';
import { TenderUserService } from './services/tender-user.service';
import { ProposalModule } from '../../proposal-management/proposal/proposal.module';

const importedModule = [
  CqrsModule,
  forwardRef(() => ClientModule),
  ProposalModule,
];

const controllers = [TenderUserController];
const repositories: Provider[] = [];
const commands: Provider[] = [
  // User Domain
  TenderUserService,
  UserCreateCommandHandler,
  UserUpdateCommandHandler,
  UserUpdateStatusCommandHandler,
  UserSoftDeleteCommandHandler,
  UserUpdateProfileCommandHandler,
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
