import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalGovernorateRepository } from './repositories/proposal.governorate.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [ProposalGovernorateRepository];
const exportedProviders: Provider[] = [...repositories];
@Module({
  imports: [...importedModule],
  providers: [...repositories],
  exports: [...exportedProviders],
})
export class ProposalGovernorateModule {}
