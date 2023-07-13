import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalFollowUpCreateCommandHandler } from 'src/proposal-management/follow-up/commands/proposal.follow.up.create/proposal.follow.up.create.command';
import { ProposalModule } from 'src/proposal-management/proposal/proposal.module';
import { ProposalFollowUpController } from './controllers/proposal.follow.up.controller';
import { ProposalFollowUpRepository } from './repositories/proposal.follow.up.repository';
import { ProposalFollowUpService } from './services/proposal-follow-up.service';

const importedModule = [CqrsModule, ProposalModule];
const commands: Provider[] = [ProposalFollowUpCreateCommandHandler];
const queries: Provider[] = [];
const repositories: Provider[] = [
  ProposalFollowUpRepository,
  ProposalFollowUpService,
];
const exportedProvider: Provider[] = [ProposalFollowUpRepository];

@Module({
  imports: [...importedModule],
  controllers: [ProposalFollowUpController],
  providers: [...commands, ...queries, ...repositories],
  exports: [...exportedProvider],
})
export class ProposalFollowUpModule {}
