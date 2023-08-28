import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../prisma/prisma.service';
import { GovernorateEntity } from '../entities/governorate.entity';

export class GovernorateCreateProps {
  governorate_id?: string;
  region_id: string;
  name: string;
}

export class GovernorateUpdateProps {
  governorate_id: string;
  region_id?: string;
  name?: string;
  is_deleted?: boolean;
}

export class GovernorateFindManyProps {
  name?: string;
  is_deleted?: 'Y' | 'N';
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class GovernorateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: GovernorateCreateProps,
    session?: PrismaService,
  ): Promise<GovernorateEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.governorate.create({
        data: {
          governorate_id: props.governorate_id || nanoid(),
          name: props.name,
          region_id: props.region_id,
        },
      });

      const createdEntity = Builder<GovernorateEntity>(GovernorateEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: GovernorateUpdateProps,
    session?: PrismaService,
  ): Promise<GovernorateEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      // console.log('update props', props);
      const rawUpdated = await prisma.governorate.update({
        where: { governorate_id: props.governorate_id },
        data: {
          name: props.name,
          region_id: props.region_id,
          is_deleted: props.is_deleted,
        },
      });

      const updatedEntity = Builder<GovernorateEntity>(GovernorateEntity, {
        ...rawUpdated,
      }).build();
      // console.log('updated entity', updatedEntity);
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    governorate_id: string,
    session?: PrismaService,
  ): Promise<GovernorateEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.governorate.findFirst({
        where: { governorate_id: governorate_id },
      });
      if (!result) return null;
      return Builder<GovernorateEntity>(GovernorateEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: GovernorateFindManyProps) {
    const { name, is_deleted, include_relations } = props;
    let args: Prisma.GovernorateFindManyArgs = {};
    let whereClause: Prisma.GovernorateWhereInput = {};

    if (name) {
      whereClause = {
        ...whereClause,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }

    if (is_deleted !== undefined) {
      if (is_deleted === 'Y') {
        whereClause = {
          ...whereClause,
          is_deleted: true,
        };
      }
      if (is_deleted === 'N') {
        whereClause = {
          ...whereClause,
          is_deleted: false,
        };
      }
    }

    if (include_relations && include_relations.length > 0) {
      let include: Prisma.GovernorateInclude = {};

      for (const relation of include_relations) {
        if (relation === 'region_detail') {
          include = {
            ...include,
            region_detail: true,
          };
          args.include = include;
        }
      }
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: GovernorateFindManyProps,
    session?: PrismaService,
  ): Promise<GovernorateEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      // console.log(logUtil(args));
      let queryOptions: Prisma.GovernorateFindManyArgs = {
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

      const rawResult = await prisma.governorate.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<GovernorateEntity>(GovernorateEntity, {
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
    props: GovernorateFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.clientFields.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async deleteMany(
    governorate_id: string[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawResult = await prisma.governorate.updateMany({
        where: {
          governorate_id: { in: governorate_id },
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
