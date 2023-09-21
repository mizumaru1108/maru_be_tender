import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EditRequestRepository } from './repositories/edit.request.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [EditRequestRepository];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [...repositories];
@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class EditRequestModule {}
