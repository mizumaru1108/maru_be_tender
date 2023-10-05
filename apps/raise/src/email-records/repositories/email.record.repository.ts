import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailRecordEntity } from '../entities/email.record.entity';

export class EmailRecordCreateProps {
  email_record_id?: string;
  title: string;
  content: string;
  attachments?: string;
  sender_id: string;
  user_on_app: boolean;
  receiver_id?: string;
  receiver_name?: string;
  receiver_email?: string;
}

// export class MailingUpdateProps {
//   email_record_id: string;
// }

export type EmailRecordIncludeRelationsTypes = 'sender' | 'receiver';

export class EmailRecordFindFirstProps {
  email_record_id?: string;
  sender_id?: string;
  receiver_id?: string;
  exclude_id?: string;
  include_relations?: EmailRecordIncludeRelationsTypes[];
}

export class EmailRecordFindManyProps {
  sender_id?: string;
  receiver_id?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: EmailRecordIncludeRelationsTypes[];
}

@Injectable()
export class EmailRecordRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': EmailRecordRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  applyInclude(include_relations: EmailRecordIncludeRelationsTypes[]) {
    let include: Prisma.email_recordInclude = {};
    // console.log({ include_relations });
    for (const relation of include_relations) {
      if (relation === 'sender') {
        include = {
          ...include,
          sender: {
            select: {
              id: true,
              employee_name: true,
              email: true,
            },
          },
        };
      }

      if (relation === 'receiver') {
        include = {
          ...include,
          receiver: {
            select: {
              id: true,
              employee_name: true,
              email: true,
            },
          },
        };
      }
    }
    return include;
  }

  findFirstFilter(props: EmailRecordFindFirstProps) {
    const args: Prisma.email_recordFindFirstArgs = {};
    let whereClause: Prisma.email_recordWhereInput = {};

    if (props.email_record_id) {
      whereClause.email_record_id = props.email_record_id;
    }
    if (props.sender_id) whereClause.sender_id = props.sender_id;
    if (props.receiver_id) whereClause.receiver_id = props.receiver_id;
    if (props.exclude_id) {
      whereClause.email_record_id = { notIn: [props.exclude_id] };
    }

    args.where = whereClause;

    if (props.include_relations && props.include_relations.length > 0) {
      args.include = this.applyInclude(props.include_relations);
    }

    return args;
  }

  async findFirst(
    props: EmailRecordFindFirstProps,
    tx?: PrismaService,
  ): Promise<EmailRecordEntity | null> {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const args = this.findFirstFilter(props);
      const rawMailing = await prisma.email_record.findFirst({
        where: args.where,
        include: args.include,
      });

      if (!rawMailing) return null;

      const entity = Builder<EmailRecordEntity>(
        EmailRecordEntity,
        rawMailing,
      ).build();

      return entity;
    } catch (err) {
      this.logger.error(`error when finding email_record by id ${err}`);
      throw err;
    }
  }

  async create(
    props: EmailRecordCreateProps,
    tx?: PrismaService,
  ): Promise<EmailRecordEntity> {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const rawCreated = await prisma.email_record.create({
        data: {
          email_record_id: props.email_record_id || nanoid(),
          title: props.title,
          content: props.content,
          attachments: props.attachments,
          sender_id: props.sender_id,
          user_on_app: props.user_on_app,
          receiver_id: props.receiver_id,
          receiver_name: props.receiver_name,
          receiver_email: props.receiver_email,
        },
      });

      return Builder<EmailRecordEntity>(EmailRecordEntity, rawCreated).build();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  // async update(props: MailingUpdateProps, tx?: PrismaService) {
  //   let prisma = this.prismaService;
  //   if (tx) prisma = tx;
  //   try {
  //     const rawCreated = await prisma.email_record.update({
  //       where: { id: props.id },
  //       data: {
  //         name: props.name,
  //         with_consultation: props.with_consultation,
  //         is_deleted: props.is_deleted,
  //       },
  //     });

  //     return Builder<EmailRecordEntity>(EmailRecordEntity, rawCreated).build();
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw err;
  //   }
  // }

  findManyFilters(props: EmailRecordFindManyProps) {
    const args: Prisma.email_recordFindManyArgs = {};
    let whereClause: Prisma.email_recordWhereInput = {};

    if (props.sender_id) whereClause.sender_id = props.sender_id;
    if (props.receiver_id) whereClause.receiver_id = props.receiver_id;

    if (props.include_relations && props.include_relations.length > 0) {
      args.include = this.applyInclude(props.include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findMany(props: EmailRecordFindManyProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const options = this.findManyFilters(props);
      let queryOptions: Prisma.email_recordFindManyArgs = {
        where: options.where,

        orderBy: {
          [getSortBy]: getSortDirection,
        },

        include: options.include,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      const rawResults = await prisma.email_record.findMany(queryOptions);

      const entities = rawResults.map((rawMailing) => {
        return Builder<EmailRecordEntity>(
          EmailRecordEntity,
          rawMailing,
        ).build();
      });

      return entities;
    } catch (error) {
      throw error;
    }
  }

  async countMany(props: EmailRecordFindManyProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const queryOptions = this.findManyFilters(props);
      const result = await prisma.email_record.count({
        where: queryOptions.where,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
