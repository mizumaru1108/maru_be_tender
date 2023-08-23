import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';

const importedModule = [CqrsModule, UserModule, ClientModule];
@Module({
  imports: [...importedModule],
})
export class UserManagementModule {}
