import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalEditRequestRepository } from './repositories/proposal.edit.request.repository';

const importedModule = [CqrsModule];
const commands: Provider[] = [];
const queries: Provider[] = [];
const repositories: Provider[] = [ProposalEditRequestRepository];
const exportedProvider: Provider[] = [ProposalEditRequestRepository];

@Module({
  imports: [...importedModule],
  providers: [...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalEditRequestModule {}
