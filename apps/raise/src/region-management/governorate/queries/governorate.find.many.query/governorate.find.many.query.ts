import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GovernorateRepository } from '../../repositories/governorate.repository';
import { GovernorateEntity } from '../../entities/governorate.entity';

export class GovernorateFindManyQuery {
  name?: string;
  is_deleted?: 'Y' | 'N';
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class GovernorateFindManyQueryResult {
  data: GovernorateEntity[];
  total: number;
}

@QueryHandler(GovernorateFindManyQuery)
export class GovernorateFindManyQueryHandler
  implements
    IQueryHandler<GovernorateFindManyQuery, GovernorateFindManyQueryResult>
{
  constructor(private readonly regionRepo: GovernorateRepository) {}

  async execute(
    query: GovernorateFindManyQuery,
  ): Promise<GovernorateFindManyQueryResult> {
    const data = await this.regionRepo.findMany({ ...query });
    const total = await this.regionRepo.countMany({ ...query });
    return {
      data,
      total,
    };
  }
}
