import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalLogRepository } from './repositories/proposal.log.repository';

const importedModule = [CqrsModule];

const commands: Provider[] = [];

const queries: Provider[] = [];

const repositories: Provider[] = [ProposalLogRepository];

const exportedProvider: Provider[] = [ProposalLogRepository];

@Module({
  imports: [...importedModule],
  controllers: [],
  providers: [...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalLogModule {}
