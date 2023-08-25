import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegionEntity } from '../entities/region.entity';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

export class RegionCreateProps {
  region_id?: string;
  name: string;
}

export class RegionUpdateProps {
  region_id: string;
  name?: string;
  is_deleted?: boolean;
}

export class RegionFindManyProps {
  name?: string;
  is_deleted?: 'Y' | 'N';
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class RegionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: RegionCreateProps,
    session?: PrismaService,
  ): Promise<RegionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.region.create({
        data: {
          region_id: props.region_id || nanoid(),
          name: props.name,
        },
      });

      const createdEntity = Builder<RegionEntity>(RegionEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: RegionUpdateProps,
    session?: PrismaService,
  ): Promise<RegionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      // console.log('update props', props);
      const rawUpdated = await prisma.region.update({
        where: { region_id: props.region_id },
        data: {
          name: props.name,
          is_deleted: props.is_deleted,
        },
      });

      const updatedEntity = Builder<RegionEntity>(RegionEntity, {
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
    region_id: string,
    session?: PrismaService,
  ): Promise<RegionEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.region.findFirst({
        where: { region_id: region_id },
      });
      if (!result) return null;
      return Builder<RegionEntity>(RegionEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: RegionFindManyProps) {
    const { name, is_deleted, include_relations } = props;
    let args: Prisma.RegionFindManyArgs = {};
    let whereClause: Prisma.RegionWhereInput = {};

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
      let include: Prisma.RegionInclude = {};

      for (const relation of include_relations) {
        if (relation === 'governorate') {
          include = {
            ...include,
            governorate: true,
          };
        }
      }

      args.include = include;
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: RegionFindManyProps,
    session?: PrismaService,
  ): Promise<RegionEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.RegionFindManyArgs = {
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

      const rawResult = await prisma.region.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<RegionEntity>(RegionEntity, {
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
    props: RegionFindManyProps,
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
    region_id: string[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawResult = await prisma.region.updateMany({
        where: {
          region_id: { in: region_id },
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
