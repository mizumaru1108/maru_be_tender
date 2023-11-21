import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SmsGatewayEntity } from '../../entities/sms.gateway.entity';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';
import { NotFoundException } from '@nestjs/common';

export class SmsConfigFindByIdQuery {
  id: string;
}

export class SmsConfigFindByIdQueryResult {
  data: SmsGatewayEntity;
}

@QueryHandler(SmsConfigFindByIdQuery)
export class SmsConfigFindByIdQueryHandler
  implements
    IQueryHandler<SmsConfigFindByIdQuery, SmsConfigFindByIdQueryResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    query: SmsConfigFindByIdQuery,
  ): Promise<SmsConfigFindByIdQueryResult> {
    try {
      const data = await this.smsConfigRepo.findById(query.id);
      if (!data) throw new NotFoundException('Sms Config Not Found!');
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
