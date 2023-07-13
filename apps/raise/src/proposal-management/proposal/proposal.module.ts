import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TenderTrackModule } from '../../tender-track/track.module';
import { ProposalEditRequestModule } from '../edit-requests/proposal.edit.request.module';
import { ProposalItemBudgetModule } from '../item-budget/proposal.item.budget.module';
import { ProposalLogModule } from '../proposal-log/proposal.log.module';
import { ChangeStateCommandHandler } from './commands/change.state/change.state.command';
import { SendAmandementCommandHandler } from './commands/send.amandement/send.amandement.command';
import { TenderProposalController } from './controllers/proposal.controller';
import { ProposalRepository } from './repositories/proposal.repository';
import { ProposalService } from './services/proposal.service';

const importedModule = [
  CqrsModule,
  ProposalEditRequestModule,
  TenderTrackModule,
  ProposalLogModule,
  ProposalItemBudgetModule,
];

const commands: Provider[] = [
  ChangeStateCommandHandler,
  SendAmandementCommandHandler,
];

const queries: Provider[] = [];

const repositories: Provider[] = [ProposalRepository];

const exportedProvider: Provider[] = [ProposalRepository];

@Module({
  imports: [...importedModule],
  controllers: [TenderProposalController],
  providers: [ProposalService, ...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalModule {}
