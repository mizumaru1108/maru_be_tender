import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RegionEntity } from '../../entities/region.entity';
import { RegionRepository } from '../../repositories/region.repository';

export class RegionFindManyQuery {
  name?: string;
  is_deleted?: 'Y' | 'N';
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class RegionFindManyQueryResult {
  data: RegionEntity[];
  total: number;
}

@QueryHandler(RegionFindManyQuery)
export class RegionFindManyQueryHandler
  implements IQueryHandler<RegionFindManyQuery, RegionFindManyQueryResult>
{
  constructor(private readonly regionRepo: RegionRepository) {}

  async execute(
    query: RegionFindManyQuery,
  ): Promise<RegionFindManyQueryResult> {
    const data = await this.regionRepo.findMany({ ...query });
    const total = await this.regionRepo.countMany({ ...query });
    return {
      data,
      total,
    };
  }
}
