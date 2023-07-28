import { ProposalCloseReportEntity } from 'src/proposal-management/closing-report/entity/proposal.close.report.entity';

export class ClosingReportExecutionPlacesEntity {
  id: string;
  closing_report_id: string;
  closing_report: ProposalCloseReportEntity;
  selected_values: string;
  selected_numbers: number;
}
