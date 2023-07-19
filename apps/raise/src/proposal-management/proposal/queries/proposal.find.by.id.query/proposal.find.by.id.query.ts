import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProposalEntity } from 'src/proposal-management/proposal/entities/proposal.entity';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
export class ProposalFindByIdQuery {
  id: string;
  relation: string[];
}

export class ProposalFindByIdQueryResult {
  proposal: ProposalEntity;
}

@QueryHandler(ProposalFindByIdQuery)
export class ProposalFindByIdQueryHandler
  implements IQueryHandler<ProposalFindByIdQuery, ProposalFindByIdQueryResult>
{
  constructor(private readonly proposalRepo: ProposalRepository) {}

  async execute(
    query: ProposalFindByIdQuery,
  ): Promise<ProposalFindByIdQueryResult> {
    const res = await this.proposalRepo.fetchById({
      id: query.id,
      includes_relation: query.relation,
    });

    if (!res) {
      throw new DataNotFoundException(
        `Proposal with id of ${query.id} not found!`,
      );
    }

    return {
      proposal: res,
    };
  }
}
