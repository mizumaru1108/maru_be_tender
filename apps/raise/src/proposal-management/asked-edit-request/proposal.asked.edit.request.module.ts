import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalAskedEditRequestRepository } from './repositories/proposal.asked.edit.request.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [ProposalAskedEditRequestRepository];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [ProposalAskedEditRequestRepository];

@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ProposalAskedEditRequestModule {}
