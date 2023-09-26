import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalRegionRepository } from './repositories/proposal.region.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [ProposalRegionRepository];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [...repositories];

@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ProposalRegionModule {}
