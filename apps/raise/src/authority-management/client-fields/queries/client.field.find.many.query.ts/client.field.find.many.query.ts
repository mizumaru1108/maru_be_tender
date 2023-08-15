import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientFieldEntity } from '../../entities/client.field.entity';
import { ClientFieldRepository } from '../../repositories/client.field.repository';
export class ClientFieldFindManyQuery {
  name?: string;
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class ClientFieldFindManyQueryResult {
  result: ClientFieldEntity[];
  total: number;
}

@QueryHandler(ClientFieldFindManyQuery)
export class ClientFieldFindManyQueryHandler
  implements
    IQueryHandler<ClientFieldFindManyQuery, ClientFieldFindManyQueryResult>
{
  constructor(private readonly clientFieldRepo: ClientFieldRepository) {}

  async execute(
    query: ClientFieldFindManyQuery,
  ): Promise<ClientFieldFindManyQueryResult> {
    const result = await this.clientFieldRepo.findMany({ ...query });
    const total = await this.clientFieldRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
