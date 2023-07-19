import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';

// TODO: Fix this to find the ads by the user requirement ex: internal / external
export class AdvertisementFindMyAdsQuery {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class AdvertisementFindMyAdsQueryResult {
  result: AdvertisementEntity[];
  total: number;
}

@QueryHandler(AdvertisementFindMyAdsQuery)
export class AdvertisementFindMyAdsQueryHandler
  implements
    IQueryHandler<
      AdvertisementFindMyAdsQuery,
      AdvertisementFindMyAdsQueryResult
    >
{
  constructor(private readonly adsRepo: AdvertisementRepository) {}

  async execute(
    query: AdvertisementFindMyAdsQuery,
  ): Promise<AdvertisementFindMyAdsQueryResult> {
    const result = await this.adsRepo.findMany({ ...query });
    const total = await this.adsRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
