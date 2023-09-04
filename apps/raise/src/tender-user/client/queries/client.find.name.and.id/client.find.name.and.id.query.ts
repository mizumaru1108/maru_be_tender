import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ClientDataEntity } from '../../entities/client-data.entity';
import { TenderClientRepository } from '../../repositories/tender-client.repository';
export class ClientFindNameAndIdQuery {
  user_name?: string;
  client_name?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class ClientFindNameAndIdQueryResult {
  result: ClientDataEntity[];
  total: number;
}

@QueryHandler(ClientFindNameAndIdQuery)
export class ClientFindNameAndIdQueryHandler
  implements
    IQueryHandler<ClientFindNameAndIdQuery, ClientFindNameAndIdQueryResult>
{
  constructor(private readonly clientRepo: TenderClientRepository) {}

  async execute(
    query: ClientFindNameAndIdQuery,
  ): Promise<ClientFindNameAndIdQueryResult> {
    const result = await this.clientRepo.findManyNameAndId({ ...query });
    const total = await this.clientRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
