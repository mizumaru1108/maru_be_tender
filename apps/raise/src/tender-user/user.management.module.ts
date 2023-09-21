import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { EditRequestModule } from './edit-requests/edit.request.module';

const importedModule = [
  CqrsModule,
  UserModule,
  ClientModule,
  EditRequestModule,
];
@Module({
  imports: [...importedModule],
})
export class UserManagementModule {}
