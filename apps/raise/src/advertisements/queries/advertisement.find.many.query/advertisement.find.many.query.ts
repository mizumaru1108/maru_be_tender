import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import {
  AdvertisementFindManyResponse,
  AdvertisementRepository,
} from 'src/advertisements/repositories/advertisement.repository';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
export class AdvertisementFindManyQuery {
  track_id: string[];
  type: AdvertisementTypeEnum[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class AdvertisementFindManyQueryResult {
  @ApiProperty()
  result: AdvertisementFindManyResponse[];
  @ApiProperty()
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
    const result = await this.adsRepo.findMany({
      ...query,
      expired_field: true,
    });
    const total = await this.adsRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
