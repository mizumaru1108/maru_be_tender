import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrackEntity } from '../../entities/track.entity';
import {
  TrackIncludeRelationsTypes,
  TrackRepository,
} from '../../repositories/track.repository';

export class TrackFindManyQuery {
  track_name?: string;
  include_general?: '1' | '0';
  is_deleted?: '1' | '0';
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: TrackIncludeRelationsTypes[];
}

export class TrackFindManyQueryResult {
  data: TrackEntity[];
  total: number;
}

@QueryHandler(TrackFindManyQuery)
export class TrackFindManyQueryHandler
  implements IQueryHandler<TrackFindManyQuery, TrackFindManyQueryResult>
{
  constructor(private readonly trackRepo: TrackRepository) {}

  async execute(query: TrackFindManyQuery): Promise<TrackFindManyQueryResult> {
    const data = await this.trackRepo.findMany({
      ...query,
    });
    const total = await this.trackRepo.countMany({ ...query });
    return {
      data,
      total,
    };
  }
}
