import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClosingReportBeneficiaryRepository } from 'src/proposal-management/closing-report/repositories/closing.report.beneficiary.repository';
import { ClosingReportExecutionPlacesRepository } from 'src/proposal-management/closing-report/repositories/closing.report.execution.places.repository';
import { ClosingReportGendersRepository } from 'src/proposal-management/closing-report/repositories/closing.report.genders.repository';
import { ProposalCloseReportRepository } from 'src/proposal-management/closing-report/repositories/proposal.close.report.repository';

const importedModule = [CqrsModule];
const repositories: Provider[] = [
  ProposalCloseReportRepository,
  ClosingReportBeneficiaryRepository,
  ClosingReportGendersRepository,
  ClosingReportExecutionPlacesRepository,
];

const commands: Provider[] = [];
const queries: Provider[] = [];

const exportedProviders: Provider[] = [
  ProposalCloseReportRepository,
  ClosingReportBeneficiaryRepository,
  ClosingReportGendersRepository,
  ClosingReportExecutionPlacesRepository,
];

@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ProposalCloseReportModule {}
