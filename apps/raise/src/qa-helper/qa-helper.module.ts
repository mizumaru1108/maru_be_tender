import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalItemBudgetModule } from '../proposal-management/item-budget/proposal.item.budget.module';
import { ProposalProjectTimelineModule } from '../proposal-management/poject-timelines/proposal.project.timeline.module';
import { ProposalLogModule } from '../proposal-management/proposal-log/proposal.log.module';
import { ProposalModule } from '../proposal-management/proposal/proposal.module';
import { UserModule } from '../tender-user/user/user.module';
import { QaProposalCreateNewModeratorStateCommandHandler } from './commands/qa.proposal.create.new.moderator/qa.proposal.create.new.moderator.command';
import { QaProposalCreateNewSupervisorCommandHandler } from './commands/qa.proposal.create.new.supervisor/qa.proposal.create.new.supervisor.command';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';
import { QaHelperControllers } from './controllers/qa-helper.controller';
import { TrackModule } from '../track-management/track/track.module';
import { PurgeUserCommandHandler } from './commands/purge.user.command.ts/purge.user.command';
import { QAAddUserByJsonCommandHandler } from './commands/qa.add.user.by.json.command/qa.add.user.by.json.command';
import { QaHelperUserControllers } from './controllers/qa.helper.user.controller';
import { QAAddClientDataByJsonCommandHandler } from './commands/qa.add.client.data.command/qa.add.client.data.by.json.command';

const commands: Provider[] = [
  QaProposalCreateNewModeratorStateCommandHandler,
  QaProposalDeleteCommandHandler,
  QaProposalCreateNewSupervisorCommandHandler,
  PurgeUserCommandHandler,
  QAAddUserByJsonCommandHandler,
  QAAddClientDataByJsonCommandHandler,
];

const importedModules = [
  CqrsModule,
  ProposalModule,
  ProposalLogModule,
  ProposalItemBudgetModule,
  ProposalProjectTimelineModule,
  TrackModule,
  UserModule,
];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers, QaHelperUserControllers],
  providers: [...commands],
})
export class QaHelperModule {}
