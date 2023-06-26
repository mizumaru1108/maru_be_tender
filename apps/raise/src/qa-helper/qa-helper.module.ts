import { Module, Provider } from '@nestjs/common';
import { QaHelperControllers } from './controllers/qa-helper.controller';
import { QaProposalCreateNewCommandHandler } from './commands/qa.proposal.create.new/qa.proposal.create.new.command';
import { TenderProposalModule } from '../tender-proposal/tender-proposal.module';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';
import { CqrsModule } from '@nestjs/cqrs';

const commands: Provider[] = [
  QaProposalCreateNewCommandHandler,
  QaProposalDeleteCommandHandler,
];
const importedModules = [CqrsModule, TenderProposalModule];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
