import { Module, Provider } from '@nestjs/common';
import { QaHelperControllers } from './controllers/qa-helper.controller';
import { QaProposalCreateNewModeratorStateCommandHandler } from './commands/qa.proposal.create.new.moderator/qa.proposal.create.new.moderator.command';
import { ProposalManagementModule } from '../proposal-management/proposal.management.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';
import { QaProposalCreateNewSupervisorCommandHandler } from './commands/qa.proposal.create.new.supervisor/qa.proposal.create.new.supervisor.command';
import { TenderTrackModule } from '../tender-track/track.module';
import { TenderUserModule } from '../tender-user/tender-user.module';
import { ProposalProjectTimelineModule } from '../proposal-management/poject-timelines/proposal.project.timeline.module';
import { ProposalModule } from '../proposal-management/proposal/proposal.module';
import { ProposalLogModule } from '../proposal-management/proposal-log/proposal.log.module';
import { ProposalItemBudgetModule } from '../proposal-management/item-budget/proposal.item.budget.module';

const commands: Provider[] = [
  QaProposalCreateNewModeratorStateCommandHandler,
  QaProposalDeleteCommandHandler,
  QaProposalCreateNewSupervisorCommandHandler,
];

const importedModules = [
  CqrsModule,
  ProposalModule,
  ProposalLogModule,
  ProposalItemBudgetModule,
  ProposalProjectTimelineModule,
  TenderTrackModule,
  TenderUserModule,
];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
