import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalSelectEnum } from '../../dtos/queries/proposal.report.list.query.dto';
import { OutterStatusEnum } from '../../../../tender-commons/types/proposal';
export class ProposalReportListQuery {
  selected_columns?: ProposalSelectEnum[];
  outter_status?: OutterStatusEnum[];
  partner_name?: string;
  partner_id?: string[];
  region_id?: string[];
  benificiary_id?: string[];
  governorate_id?: string[];
  track_id?: string[];
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class ProposalReportListQueryResult {
  result: ProposalEntity[];
  total: number;
}

@QueryHandler(ProposalReportListQuery)
export class ProposalReportListQueryHandler
  implements
    IQueryHandler<ProposalReportListQuery, ProposalReportListQueryResult>
{
  constructor(private readonly proposalRepo: ProposalRepository) {}

  async execute(
    query: ProposalReportListQuery,
  ): Promise<ProposalReportListQueryResult> {
    const result = await this.proposalRepo.findMany({ ...query });
    const total = await this.proposalRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
