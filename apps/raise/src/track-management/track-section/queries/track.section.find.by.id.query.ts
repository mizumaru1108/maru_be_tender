import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { TrackSectionEntity } from '../entities/track.section.entity';
import {
  TrackSectionIncludeTypes,
  TrackSectionRepository,
} from '../repositories/track.section.repository';

export class TrackSectionFindByIdQuery {
  id: string;
  include_relations?: TrackSectionIncludeTypes[];
}

export class TrackSectionFindByIdQueryResult {
  data: TrackSectionEntity;
}

@QueryHandler(TrackSectionFindByIdQuery)
export class TrackSectionFindByIdQueryHandler
  implements
    IQueryHandler<TrackSectionFindByIdQuery, TrackSectionFindByIdQueryResult>
{
  constructor(private readonly sectionRepo: TrackSectionRepository) {}

  async execute(
    query: TrackSectionFindByIdQuery,
  ): Promise<TrackSectionFindByIdQueryResult> {
    try {
      const data = await this.sectionRepo.findFirst({
        ...query,
      });
      if (!data) throw new DataNotFoundException(`Banner not Found!`);
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
