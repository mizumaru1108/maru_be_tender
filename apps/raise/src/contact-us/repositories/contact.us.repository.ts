import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactUsEntity } from '../entities/contact.us.entity';
import { ContactUsInquiryEnum } from '../types/contact.us.type';
import { nanoid } from 'nanoid';

export class ContactUsCreateProps {
  contact_us_id?: number;
  inquiry_type: ContactUsInquiryEnum;
  submitter_user_id: string;
  title?: string;
  message?: string;
  date_of_visit?: Date;
  visit_reason?: string;
  proposal_id?: string;
}
export class ContactUsUpdateProps {}
export class ContactUsFindManyProps {
  include_relations?: string[];
  inquiry_type?: ContactUsInquiryEnum[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ContactUsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ContactUsCreateProps,
    session?: PrismaService,
  ): Promise<ContactUsEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.contactUs.create({
        data: {
          inquiry_type: props.inquiry_type,
          submitter_user_id: props.submitter_user_id,
          title: props.title,
          message: props.message,
          date_of_visit: props.date_of_visit,
          visit_reason: props.visit_reason,
          proposal_id: props.proposal_id,
        },
      });

      const createdEntity = Builder<ContactUsEntity>(ContactUsEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: ContactUsUpdateProps,
    session?: PrismaService,
  ): Promise<ContactUsEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.contactUs.update({
        where: {},
        data: {},
      });

      const updatedEntity = Builder<ContactUsEntity>(ContactUsEntity, {
        ...rawUpdated,
      }).build();
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    contact_us_id: number,
    session?: PrismaService,
  ): Promise<ContactUsEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.contactUs.findFirst({
        where: { contact_us_id: contact_us_id },
      });
      if (!result) return null;
      return Builder<ContactUsEntity>(ContactUsEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: ContactUsFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.ContactUsFindManyArgs = {};
    let whereArgs: Prisma.ContactUsWhereInput = {};

    if (props.inquiry_type !== undefined) {
      whereArgs = {
        ...whereArgs,
        inquiry_type: {
          in: props.inquiry_type,
        },
      };
    }

    if (include_relations && include_relations.length > 0) {
      let include: Prisma.ContactUsInclude = {};

      for (const relation of include_relations) {
        if (relation === 'user') {
          include = {
            ...include,
            user: true,
          };
        }
      }

      args.include = include;
    }
    args.where = whereArgs;
    return args;
  }
  async findMany(
    props: ContactUsFindManyProps,
    session?: PrismaService,
  ): Promise<ContactUsEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.ContactUsFindManyArgs = {
        where: args.where,
        include: args.include,
        orderBy: {
          [getSortBy]: getSortDirection,
        },
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      const rawProducts = await prisma.contactUs.findMany(queryOptions);
      const entities = rawProducts.map((rawProducts) => {
        return Builder<ContactUsEntity>(ContactUsEntity, {
          ...rawProducts,
        }).build();
      });
      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: ContactUsFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.contactUs.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
