import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { email_record, Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { FindManyResult } from '../../tender-commons/dto/find-many-result.dto';
import { EmailFilterRequest } from '../dtos/requests/email-filter-request.dto';

@Injectable()
export class TenderEmailRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderEmailRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  /* save email record */
  async createNewEmailRecord(createPayload: Prisma.email_recordCreateArgs) {
    this.logger.debug('create new email record...');
    try {
      return await this.prismaService.email_record.create(createPayload);
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something went wrong when saving new email record!',
      );
    }
  }

  async findMany(
    searchParams: EmailFilterRequest,
  ): Promise<FindManyResult<email_record[]>> {
    const { receiver_id, sender_id, page = 1, limit = 10 } = searchParams;
    const offset = (page - 1) * limit;

    let query: Prisma.email_recordWhereInput = {};

    if (receiver_id) {
      query = {
        ...query,
        receiver_id: receiver_id,
      };
    }

    if (sender_id) {
      query = {
        ...query,
        sender_id: sender_id,
      };
    }

    const result = await this.prismaService.email_record.findMany({
      where: {
        ...query,
      },
      skip: offset,
      take: limit,
    });

    /* why 2 queries ?, because the prev is using take. */
    const count = await this.prismaService.email_record.count({
      where: {
        ...query,
      },
    });

    return {
      data: result,
      total: count,
    };
  }

  /* Get all my outbox */
}
