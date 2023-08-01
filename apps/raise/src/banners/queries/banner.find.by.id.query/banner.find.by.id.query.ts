import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import { BannerRepository } from 'src/banners/repositories/banner.repository';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';

export class BannerFindByIdQuery {
  banner_id: string;
}

export class BannerFindByIdQueryResult {
  banner: BannerEntity;
}

@QueryHandler(BannerFindByIdQuery)
export class BannerFindByIdQueryHandler
  implements IQueryHandler<BannerFindByIdQuery, BannerFindByIdQueryResult>
{
  constructor(private readonly adsRepo: BannerRepository) {}

  async execute(
    query: BannerFindByIdQuery,
  ): Promise<BannerFindByIdQueryResult> {
    try {
      const result = await this.adsRepo.findById(query.banner_id);
      if (!result) throw new DataNotFoundException(`Banner not Found!`);
      return {
        banner: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
