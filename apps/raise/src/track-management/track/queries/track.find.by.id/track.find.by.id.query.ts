import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  TrackIncludeRelationsTypes,
  TrackRepository,
} from '../../repositories/track.repository';
import { TrackEntity } from '../../entities/track.entity';
import { NotFoundException } from '@nestjs/common';

export class TrackFindByIdQuery {
  track_id?: string;
  include_relations?: TrackIncludeRelationsTypes[];
}

export class TrackFindByIdQueryResult {
  data: TrackEntity;
}

@QueryHandler(TrackFindByIdQuery)
export class TrackFindByIdQueryHandler
  implements IQueryHandler<TrackFindByIdQuery, TrackFindByIdQueryResult>
{
  constructor(private readonly trackRepo: TrackRepository) {}

  async execute(query: TrackFindByIdQuery) {
    try {
      const data = await this.trackRepo.findFirst({
        id: query.track_id,
        ...query,
      });

      if (!data) throw new NotFoundException('Track not found!');

      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
