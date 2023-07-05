import { Module, Provider } from '@nestjs/common';
import { QaHelperControllers } from './controllers/qa-helper.controller';
import { QaProposalCreateNewModeratorStateCommandHandler } from './commands/qa.proposal.create.new.moderator/qa.proposal.create.new.moderator.command';
import { TenderProposalModule } from '../tender-proposal/tender-proposal.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';
import { QaProposalCreateNewSupervisorCommandHandler } from './commands/qa.proposal.create.new.supervisor/qa.proposal.create.new.supervisor.command';
import { TenderTrackModule } from '../tender-track/tender-track.module';
import { TenderUserModule } from '../tender-user/tender-user.module';

const commands: Provider[] = [
  QaProposalCreateNewModeratorStateCommandHandler,
  QaProposalDeleteCommandHandler,
  QaProposalCreateNewSupervisorCommandHandler,
];

const importedModules = [
  CqrsModule,
  TenderProposalModule,
  TenderTrackModule,
  TenderUserModule,
];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
