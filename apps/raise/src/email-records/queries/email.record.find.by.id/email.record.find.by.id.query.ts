import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmailRecordEntity } from '../../entities/email.record.entity';
import {
  EmailRecordIncludeRelationsTypes,
  EmailRecordRepository,
} from '../../repositories/email.record.repository';

export class EmailRecordFindByIdQuery {
  email_record_id: string;
  include_relations?: EmailRecordIncludeRelationsTypes[];
}

export class EmailRecordFindByIdQueryResult {
  data: EmailRecordEntity;
}

@QueryHandler(EmailRecordFindByIdQuery)
export class EmailRecordFindByIdQueryHandler
  implements
    IQueryHandler<EmailRecordFindByIdQuery, EmailRecordFindByIdQueryResult>
{
  constructor(private readonly emailRecordRepo: EmailRecordRepository) {}

  async execute(query: EmailRecordFindByIdQuery) {
    try {
      const data = await this.emailRecordRepo.findFirst({
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
