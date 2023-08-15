import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthoritiesModule } from './authorities/autorities.module';
import { ClientFieldModule } from './client-fields/client.field.module';

const importedModule = [CqrsModule, AuthoritiesModule, ClientFieldModule];
@Module({
  imports: [...importedModule],
})
export class AuthorityManagementModule {}
