import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import {
  AdvertisementFindManyProps,
  AdvertisementRepository,
} from 'src/advertisements/repositories/advertisement.repository';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';

// TODO: Fix this to find the ads by the user requirement ex: internal / external
export class AdvertisementFindMyAdsQuery {
  user: TenderCurrentUser;
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
    const appliedFilter: AdvertisementFindManyProps = {
      ...query,
      only_active: true,
    };

    if (query.user.choosenRole !== 'tender_client') {
      appliedFilter.type = [AdvertisementTypeEnum.INTERNAL];
      // consider that query.user.track_id is exist
      // it will, if the users wasnt client, cuz if it wasnt it will throw eror at guard
      // you can see the reference in TenderJwtGuard.
      appliedFilter.track_id = [query.user.track_id!];
    } else {
      appliedFilter.type = [AdvertisementTypeEnum.EXTERNAL];
    }

    const result = await this.adsRepo.findMany(appliedFilter);
    const total = await this.adsRepo.countMany(appliedFilter);

    return {
      result,
      total,
    };
  }
}
