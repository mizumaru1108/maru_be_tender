import { Module } from '@nestjs/common';

import { TenderClientRepository } from './client/repositories/tender-client.repository';
import { TenderClientService } from './client/services/tender-client.service';
import { TenderUserService } from './user/services/tender-user.service';
import { TenderUserController } from './user/controllers/tender-user.controller';
import { TenderClientController } from './client/controllers/tender-client.controller';
import { TenderUserRepository } from './user/repositories/tender-user.repository';
import { TenderUserRoleRepository } from './user/repositories/tender-user-role.repository';
import { TenderUserStatusLogRepository } from './user/repositories/tender-user-status-log.repository';

@Module({
  controllers: [TenderUserController, TenderClientController],
  providers: [
    // User Domain
    TenderUserService,
    TenderUserRepository,
    // Client Domain
    TenderClientService,
    TenderClientRepository,
    // Role Repository
    TenderUserRoleRepository,
    // user status log
    TenderUserStatusLogRepository,
  ],
  exports: [
    // User Domain
    TenderUserService,
    TenderUserRepository,
    // Client Domain
    TenderClientService,
    TenderClientRepository,
    // Role Repository
    TenderUserRoleRepository,
    // user status log
    TenderUserStatusLogRepository,
  ],
})
export class TenderUserModule {}
