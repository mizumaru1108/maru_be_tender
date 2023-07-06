import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalItemBudgetRepository } from './repositories/proposal.item.budget.repository';

const importedModule = [CqrsModule];

const commands: Provider[] = [];

const queries: Provider[] = [];

const repositories: Provider[] = [ProposalItemBudgetRepository];

const exportedProvider: Provider[] = [ProposalItemBudgetRepository];

@Module({
  imports: [...importedModule],
  providers: [...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalItemBudgetModule {}
