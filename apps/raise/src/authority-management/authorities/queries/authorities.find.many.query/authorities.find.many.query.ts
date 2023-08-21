import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthoritiesEntity } from '../../entities/authorities.entity';
import { AuthoritiesRepository } from '../../repositories/authorities.repository';

export class AuthoritiesFindManyQuery {
  name?: string;
  client_field_id?: string;
  is_deleted?: 'Y' | 'N';
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class AuthoritiesFindManyQueryResult {
  result: AuthoritiesEntity[];
  total: number;
}

@QueryHandler(AuthoritiesFindManyQuery)
export class AuthoritiesFindManyQueryHandler
  implements
    IQueryHandler<AuthoritiesFindManyQuery, AuthoritiesFindManyQueryResult>
{
  constructor(private readonly authoritiesRepo: AuthoritiesRepository) {}

  async execute(
    query: AuthoritiesFindManyQuery,
  ): Promise<AuthoritiesFindManyQueryResult> {
    const result = await this.authoritiesRepo.findMany({ ...query });
    const total = await this.authoritiesRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
