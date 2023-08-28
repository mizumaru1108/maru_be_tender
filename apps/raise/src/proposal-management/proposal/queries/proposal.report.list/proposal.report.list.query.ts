import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
export class ProposalReportListQuery {
  partner_name?: string[];
  region_id?: string[];
  governorate_id?: string[];
  track_id?: string[];
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
