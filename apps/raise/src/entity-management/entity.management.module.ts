import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthoritiesModule } from './authorities/autorities.module';
import { EntityModule } from './entities/entity.module';

const importedModule = [CqrsModule, AuthoritiesModule, EntityModule];
@Module({
  imports: [...importedModule],
})
export class EntityManagementModule {}
