import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContactUsEntity } from '../../entities/contact.us.entity';
import { ContactUsRepository } from '../../repositories/contact.us.repository';
import { ContactUsInquiryEnum } from '../../types/contact.us.type';
export class ContactUsFindManyQuery {
  inquiry_type?: ContactUsInquiryEnum[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class ContactUsFindManyQueryResult {
  result: ContactUsEntity[];
  total: number;
}

@QueryHandler(ContactUsFindManyQuery)
export class ContactUsFindManyQueryHandler
  implements
    IQueryHandler<ContactUsFindManyQuery, ContactUsFindManyQueryResult>
{
  constructor(private readonly contactUsRepo: ContactUsRepository) {}

  async execute(
    query: ContactUsFindManyQuery,
  ): Promise<ContactUsFindManyQueryResult> {
    const result = await this.contactUsRepo.findMany({ ...query });
    const total = await this.contactUsRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
