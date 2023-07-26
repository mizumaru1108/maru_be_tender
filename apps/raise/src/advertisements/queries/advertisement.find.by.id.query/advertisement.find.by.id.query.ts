import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';

export class AdvertisementFindByIdQuery {
  advertisement_id: string;
}

export class AdvertisementFindByIdQueryResult {
  advertisement: AdvertisementEntity;
}

@QueryHandler(AdvertisementFindByIdQuery)
export class AdvertisementFindByIdQueryHandler
  implements
    IQueryHandler<AdvertisementFindByIdQuery, AdvertisementFindByIdQueryResult>
{
  constructor(private readonly adsRepo: AdvertisementRepository) {}

  async execute(
    query: AdvertisementFindByIdQuery,
  ): Promise<AdvertisementFindByIdQueryResult> {
    try {
      const result = await this.adsRepo.findById(query.advertisement_id);
      if (!result) throw new DataNotFoundException(`Advertisement not Found!`);
      return {
        advertisement: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
