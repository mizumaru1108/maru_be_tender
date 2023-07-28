import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalCloseReportRepository } from 'src/proposal-management/closing-report/repositories/proposal.close.report.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [ProposalCloseReportRepository];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [ProposalCloseReportRepository];

@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ProposalCloseReportModule {}
