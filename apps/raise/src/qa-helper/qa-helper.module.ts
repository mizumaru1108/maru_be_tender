import { Module, Provider } from '@nestjs/common';
import { QaHelperControllers } from './controllers/qa-helper.controller';
import { QaProposalCreateNewCommandHandler } from './commands/qa.proposal.create.new/qa.proposal.create.new.command';
import { TenderProposalModule } from '../tender-proposal/tender-proposal.module';
import { QaProposalDeleteGeneratedCommandHandler } from './commands/qa.proposal.delete.generated/qa.proposal.delete.generated.command';
import { CqrsModule } from '@nestjs/cqrs';
import { QaProposalDeleteCommandHandler } from './commands/qa.proposal.delete/qa.proposal.delete.command';

const commands: Provider[] = [
  QaProposalCreateNewCommandHandler,
  QaProposalDeleteCommandHandler,
  QaProposalDeleteGeneratedCommandHandler,
];

const importedModules = [CqrsModule, TenderProposalModule];

@Module({
  imports: [...importedModules],
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
