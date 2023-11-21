import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsGatewayEntity } from '../entities/sms.gateway.entity';
import { nanoid } from 'nanoid';

export class SmsConfigCreateProps {
  id?: string;
  api_key: string;
  user_sender: string;
  username: string;
}

export class SmsConfigUpdateProps {
  id: string;
  api_key?: string;
  user_sender?: string;
  username?: string;
  is_active?: boolean;
  is_default?: boolean;
  is_deleted?: boolean;
}

export class SmsConfigFindManyProps {
  exclude_id?: string[];
  is_active?: boolean;
  is_deleted?: boolean;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class SmsConfigRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: SmsConfigCreateProps,
    session?: PrismaService,
  ): Promise<SmsGatewayEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.smsGateway.create({
        data: {
          id: props.id || nanoid(),
          api_key: props.api_key,
          user_sender: props.user_sender,
          username: props.username,
        },
      });

      const createdEntity = Builder<SmsGatewayEntity>(SmsGatewayEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: SmsConfigUpdateProps,
    session?: PrismaService,
  ): Promise<SmsGatewayEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.smsGateway.update({
        where: {
          id: props.id,
        },
        data: {
          api_key: props.api_key,
          user_sender: props.user_sender,
          username: props.username,
          is_active: props.is_active,
          is_default: props.is_default,
          is_deleted: props.is_deleted,
        },
      });

      const updatedEntity = Builder<SmsGatewayEntity>(SmsGatewayEntity, {
        ...rawUpdated,
      }).build();
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<SmsGatewayEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.smsGateway.findFirst({
        where: { id: id },
      });
      if (!result) return null;
      return Builder<SmsGatewayEntity>(SmsGatewayEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: SmsConfigFindManyProps) {
    let args: Prisma.SmsGatewayFindManyArgs = {};
    let whereClause: Prisma.SmsGatewayWhereInput = {};

    if (props.exclude_id) {
      whereClause = {
        ...whereClause,
        id: {
          notIn: props.exclude_id,
        },
      };
    }

    if (props.is_active) {
      whereClause.is_active = props.is_active;
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: SmsConfigFindManyProps,
    session?: PrismaService,
  ): Promise<SmsGatewayEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.SmsGatewayFindManyArgs = {
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

      const rawResults = await prisma.smsGateway.findMany(queryOptions);
      const entities = rawResults.map((rawResult) => {
        return Builder<SmsGatewayEntity>(SmsGatewayEntity, {
          ...rawResult,
        }).build();
      });

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: SmsConfigFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.smsGateway.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async deleteMany(ids: string[], session?: PrismaService): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawResult = await prisma.smsGateway.updateMany({
        where: {
          id: { in: ids },
        },
        data: { is_deleted: true },
      });
      return rawResult.count;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
