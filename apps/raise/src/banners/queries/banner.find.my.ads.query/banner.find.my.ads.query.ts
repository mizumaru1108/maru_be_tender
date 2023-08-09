import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import {
  BannerFindManyProps,
  BannerRepository,
} from 'src/banners/repositories/banner.repository';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';

export class BannerFindMyAdsQuery {
  user: TenderCurrentUser;
  expired_at: number;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

export class BannerFindMyAdsQueryResult {
  result: BannerEntity[];
  total: number;
}

@QueryHandler(BannerFindMyAdsQuery)
export class BannerFindMyAdsQueryHandler
  implements IQueryHandler<BannerFindMyAdsQuery, BannerFindMyAdsQueryResult>
{
  constructor(private readonly adsRepo: BannerRepository) {}

  async execute(
    query: BannerFindMyAdsQuery,
  ): Promise<BannerFindMyAdsQueryResult> {
    const appliedFilter: BannerFindManyProps = {
      ...query,
    };

    if (query.user.choosenRole !== 'tender_client') {
      appliedFilter.type = [BannerTypeEnum.INTERNAL];
      // consider that query.user.track_id is exist
      // it will, if the users wasnt client, cuz if it wasnt it will throw eror at guard
      // you can see the reference in TenderJwtGuard.
      appliedFilter.track_id = [query.user.track_id!];
    } else {
      const date = query.expired_at ? new Date(query.expired_at) : undefined;
      appliedFilter.specific_date = date;

      appliedFilter.type = [BannerTypeEnum.EXTERNAL];
    }

    const result = await this.adsRepo.findMany(appliedFilter);
    const total = await this.adsRepo.countMany(appliedFilter);

    return {
      result,
      total,
    };
  }
}
