import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ProposalConfigEntity } from '../entities/proposal.config.entity';
import { ProposalConfigRepository } from '../repositories/proposal.config.repository';
import { NotFoundException } from '@nestjs/common';
export class ProposalConfigFindFirstQuery {}

export class ProposalConfigFindFirstQueryResult {
  data: ProposalConfigEntity;
}

@QueryHandler(ProposalConfigFindFirstQuery)
export class ProposalConfigFindFirstHandler
  implements IQueryHandler<ProposalConfigFindFirstQuery>
{
  constructor(private readonly proposalConfigRepo: ProposalConfigRepository) {}

  async execute(
    query: ProposalConfigFindFirstQuery,
  ): Promise<ProposalConfigEntity> {
    try {
      const data = await this.proposalConfigRepo.findFirst({});
      if (!data) throw new NotFoundException('Config not found!');
      return data;
    } catch (error) {
      throw error;
    }
  }
}
