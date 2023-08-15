import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';

export class ProposalFindMineQuery {
  submitter_user_id: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

export class ProposalFindMineQueryResult {
  result: ProposalEntity[];
  total: number;
}

@QueryHandler(ProposalFindMineQuery)
export class ProposalFindMineQueryHandler
  implements IQueryHandler<ProposalFindMineQuery, ProposalFindMineQueryResult>
{
  constructor(private readonly proposalRepo: ProposalRepository) {}

  async execute(
    query: ProposalFindMineQuery,
  ): Promise<ProposalFindMineQueryResult> {
    const result = await this.proposalRepo.findMany({
      ...query,
    });
    const total = await this.proposalRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
