import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SmsGatewayEntity } from '../../entities/sms.gateway.entity';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';
import { NotFoundException } from '@nestjs/common';

export class SmsConfigFindFirstQuery {}

export class SmsConfigFindFirstQueryResult {
  data: SmsGatewayEntity;
}

@QueryHandler(SmsConfigFindFirstQuery)
export class SmsConfigFindFirstQueryHandler
  implements
    IQueryHandler<SmsConfigFindFirstQuery, SmsConfigFindFirstQueryResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    query: SmsConfigFindFirstQuery,
  ): Promise<SmsConfigFindFirstQueryResult> {
    try {
      const data = await this.smsConfigRepo.findFirst({});
      if (!data) throw new NotFoundException('Sms Config Not Found!');
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
