import { Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalFollowUpRepository } from './repositories/proposal.follow.up.repository';
import { ProposalFollowUpService } from './services/proposal-follow-up.service';
import { ProposalFollowUpController } from './controllers/proposal-follow-up.controller';
import { ProposalModule } from '../proposal/proposal.module';

const importedModule = [CqrsModule, forwardRef(() => ProposalModule)];
const commands: Provider[] = [];
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
