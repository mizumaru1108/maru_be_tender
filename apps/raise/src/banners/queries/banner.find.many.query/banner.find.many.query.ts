import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import {
  BannerFindManyResponse,
  BannerRepository,
} from 'src/banners/repositories/banner.repository';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
export class BannerFindManyQuery {
  track_id?: string[];
  title?: string;
  expired_at?: number;
  type: BannerTypeEnum[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

export class BannerFindManyQueryResult {
  @ApiProperty()
  result: BannerFindManyResponse[];
  @ApiProperty()
  total: number;
}

@QueryHandler(BannerFindManyQuery)
export class BannerFindManyQueryHandler
  implements IQueryHandler<BannerFindManyQuery, BannerFindManyQueryResult>
{
  constructor(private readonly adsRepo: BannerRepository) {}

  async execute(
    query: BannerFindManyQuery,
  ): Promise<BannerFindManyQueryResult> {
    const result = await this.adsRepo.findMany({
      ...query,
    });
    const total = await this.adsRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
