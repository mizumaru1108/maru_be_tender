import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SectionSupervisorRepository } from './repositories/section.supervisor.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [SectionSupervisorRepository];
const exportedModule: Provider[] = [...repositories];

@Module({
  imports: [...importedModule],
  providers: [...repositories],
  exports: [...exportedModule],
})
export class SectionSupervisorModule {}
