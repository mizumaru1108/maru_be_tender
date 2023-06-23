import { Module, Provider } from '@nestjs/common';
import { ProposalCreateCommandHandler } from './commands/proposal.create/proposal.create.command';
import { QaHelperControllers } from './controllers/qa.controller';

const commands: Provider[] = [ProposalCreateCommandHandler];

@Module({
  controllers: [QaHelperControllers],
  providers: [...commands],
})
export class QaHelperModule {}
