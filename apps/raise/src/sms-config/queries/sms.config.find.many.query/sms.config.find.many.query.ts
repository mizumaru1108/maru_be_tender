import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SmsGatewayEntity } from '../../entities/sms.gateway.entity';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';

export class SmsConfigFindManyQuery {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class SmsConfigFindManyQueryResult {
  result: SmsGatewayEntity[];
  total: number;
}

@QueryHandler(SmsConfigFindManyQuery)
export class SmsConfigFindManyQueryHandler
  implements
    IQueryHandler<SmsConfigFindManyQuery, SmsConfigFindManyQueryResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    query: SmsConfigFindManyQuery,
  ): Promise<SmsConfigFindManyQueryResult> {
    const result = await this.smsConfigRepo.findMany({ ...query });
    const total = await this.smsConfigRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
