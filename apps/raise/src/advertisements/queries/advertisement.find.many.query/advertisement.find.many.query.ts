import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';
export class AdvertisementFindManyQuery {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class AdvertisementFindManyQueryResult {
  result: AdvertisementEntity[];
  total: number;
}

@QueryHandler(AdvertisementFindManyQuery)
export class AdvertisementFindManyQueryHandler
  implements
    IQueryHandler<AdvertisementFindManyQuery, AdvertisementFindManyQueryResult>
{
  constructor(private readonly adsRepo: AdvertisementRepository) {}

  async execute(
    query: AdvertisementFindManyQuery,
  ): Promise<AdvertisementFindManyQueryResult> {
    const result = await this.adsRepo.findMany({ ...query });
    const total = await this.adsRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
