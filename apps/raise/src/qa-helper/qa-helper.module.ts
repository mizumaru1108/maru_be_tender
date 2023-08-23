import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalItemBudgetModule } from '../proposal-management/item-budget/proposal.item.budget.module';
import { ProposalProjectTimelineModule } from '../proposal-management/poject-timelines/proposal.project.timeline.module';
import { ProposalLogModule } from '../proposal-management/proposal-log/proposal.log.module';
import { ProposalModule } from '../proposal-management/proposal/proposal.module';
import { TenderTrackModule } from '../tender-track/track.module';
import { UserModule } from '../tender-user/user/user.module';
import { QaProposalCreateNewModeratorStateCommandHandler } from './commands/qa.proposal.create.new.moderator/qa.proposal.create.new.moderator.command';
import { QaProposalCreateNewSupervisorCommandHandler } from './commands/qa.proposal.create.new.supervisor/qa.proposal.create.new.supervisor.command';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';
import { QaHelperControllers } from './controllers/qa-helper.controller';

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
  UserModule,
];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
