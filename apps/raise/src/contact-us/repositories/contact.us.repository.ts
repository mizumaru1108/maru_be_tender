import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactUsEntity } from '../entities/contact.us.entity';
import { ContactUsInquiryEnum } from '../types/contact.us.type';
import { nanoid } from 'nanoid';

export class ContactUsCreateProps {
  contact_us_id?: string;
  inquiry_type: ContactUsInquiryEnum;
  submitter_user_id: string;
  title?: string;
  message?: string;
  date_of_visit?: number;
  reason_visit?: string;
  proposal_id?: string;
}
export class ContactUsUpdateProps {}
export class ContactUsFindManyProps {
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
          contact_us_id: props.contact_us_id || nanoid(),
          inquiry_type: props.inquiry_type,
          submitter_user_id: props.submitter_user_id,
          title: props.title,
          message: props.message,
          date_of_visit: props.date_of_visit,
          reason_visit: props.reason_visit,
          proposal_id: props.proposal_id,
        },
      });

      const createdEntity = Builder<ContactUsEntity>(ContactUsEntity, {
        ...rawCreated,
        date_of_visit: Number(rawCreated.date_of_visit),
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
        date_of_visit: Number(rawUpdated.date_of_visit),
      }).build();
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    contact_us_id: string,
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
        date_of_visit: Number(result.date_of_visit),
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: ContactUsFindManyProps) {
    const args: Prisma.ContactUsFindManyArgs = {};
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
          date_of_visit: Number(rawProducts.date_of_visit),
        }).build();
      });
      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // async countMany(
  //   props: ContactUsFindManyProps,
  //   session?: PrismaService,
  // ): Promise<number> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }
}
