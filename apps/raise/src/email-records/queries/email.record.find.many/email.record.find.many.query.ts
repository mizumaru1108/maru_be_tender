import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmailRecordEntity } from '../../entities/email.record.entity';
import {
  EmailRecordIncludeRelationsTypes,
  EmailRecordRepository,
} from '../../repositories/email.record.repository';

export class EmailRecordFindManyQuery {
  sender_id?: string;
  receiver_id?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: EmailRecordIncludeRelationsTypes[];
}

export class EmailRecordFindManyQueryResult {
  data: EmailRecordEntity[];
  total: number;
}

@QueryHandler(EmailRecordFindManyQuery)
export class EmailRecordFindManyQueryHandler
  implements
    IQueryHandler<EmailRecordFindManyQuery, EmailRecordFindManyQueryResult>
{
  constructor(private readonly emailRecordRepo: EmailRecordRepository) {}

  async execute(
    query: EmailRecordFindManyQuery,
  ): Promise<EmailRecordFindManyQueryResult> {
    const data = await this.emailRecordRepo.findMany({
      ...query,
    });
    const total = await this.emailRecordRepo.countMany({ ...query });
    return {
      data,
      total,
    };
  }
}
