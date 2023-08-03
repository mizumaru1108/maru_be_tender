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
import { ProposalFindByIdQueryHandler } from 'src/proposal-management/proposal/queries/proposal.find.by.id.query/proposal.find.by.id.query';
import { SendRevisionCommandHandler } from 'src/proposal-management/proposal/commands/send.revision/send.revision.command';
import { ProposalProjectTimelineModule } from 'src/proposal-management/poject-timelines/proposal.project.timeline.module';

const importedModule = [
  CqrsModule,
  ProposalEditRequestModule,
  TenderTrackModule,
  ProposalLogModule,
  ProposalItemBudgetModule,
  ProposalProjectTimelineModule,
];

const commands: Provider[] = [
  ChangeStateCommandHandler,
  SendAmandementCommandHandler,
  SendRevisionCommandHandler,
];

const queries: Provider[] = [ProposalFindByIdQueryHandler];

const repositories: Provider[] = [ProposalRepository];

const exportedProvider: Provider[] = [ProposalRepository];

@Module({
  imports: [...importedModule],
  controllers: [TenderProposalController],
  providers: [ProposalService, ...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalModule {}
