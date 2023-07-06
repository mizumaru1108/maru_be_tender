import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalTimelinePostgresRepository } from './repositories/proposal.project.timeline.repository';

const importedModule = [CqrsModule];

const commands: Provider[] = [];

const queries: Provider[] = [];

const repositories: Provider[] = [ProposalTimelinePostgresRepository];

const exportedProvider: Provider[] = [ProposalTimelinePostgresRepository];

@Module({
  imports: [...importedModule],
  providers: [...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalProjectTimelineModule {}
