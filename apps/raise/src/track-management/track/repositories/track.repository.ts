import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { TrackEntity } from '../entities/track.entity';
import { logUtil } from '../../../commons/utils/log-util';

export class TrackCreateProps {
  id?: string;
  name: string;
  with_consultation: boolean;
}
export class TrackUpdateProps {
  id: string;
  name?: string;
  with_consultation?: boolean;
  is_deleted?: boolean;
}
export class TrackFindFirstProps {
  id?: string;
  name?: string;
  exclude_id?: string;
  include_relations?: string[];
}

export class TrackFindManyProps {
  track_name?: string;
  include_general?: '1' | '0';
  is_deleted?: '1' | '0';
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

@Injectable()
export class TrackRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TrackRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    try {
      return await this.prismaService.track.findUnique({
        where: { id },
      });
    } catch (err) {
      this.logger.error(`error when finding track by id ${err}`);
      throw err;
    }
  }

  applyInclude() {}

  findFirstFilter(props: TrackFindFirstProps) {
    const args: Prisma.trackFindFirstArgs = {};
    let whereClause: Prisma.trackWhereInput = {};

    if (props.id) whereClause.id = props.id;
    if (props.name) whereClause.name = props.name;
    if (props.exclude_id) whereClause.id = { notIn: [props.exclude_id] };
    args.where = whereClause;

    return args;
  }

  async findFirst(props: TrackFindFirstProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const args = this.findFirstFilter(props);
      const rawTrack = await prisma.track.findFirst({
        where: args.where,
      });

      if (!rawTrack) return null;

      return Builder<TrackEntity>(TrackEntity, rawTrack).build();
    } catch (err) {
      this.logger.error(`error when finding track by id ${err}`);
      throw err;
    }
  }

  async create(props: TrackCreateProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const rawCreated = await prisma.track.create({
        data: {
          id: props.id || uuidv4(),
          name: props.name,
          with_consultation: props.with_consultation,
        },
      });

      return Builder<TrackEntity>(TrackEntity, rawCreated).build();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async update(props: TrackUpdateProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const rawCreated = await prisma.track.update({
        where: { id: props.id },
        data: {
          name: props.name,
          with_consultation: props.with_consultation,
          is_deleted: props.is_deleted,
        },
      });

      return Builder<TrackEntity>(TrackEntity, rawCreated).build();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  findManyFilters(props: TrackFindManyProps) {
    const { include_general = '0', track_name, is_deleted } = props;

    const args: Prisma.trackFindManyArgs = {};
    let whereClause: Prisma.trackWhereInput = {};
    if (track_name) {
      whereClause = {
        ...whereClause,
        name: {
          contains: track_name,
          mode: 'insensitive',
        },
      };
    }

    if (include_general === '0') {
      whereClause = {
        ...whereClause,
        name: {
          notIn: ['GENERAL'],
        },
      };
    }

    if (is_deleted === '1') {
      whereClause = {
        ...whereClause,
        is_deleted: true,
      };
    }

    if (is_deleted === '0') {
      whereClause = {
        ...whereClause,
        is_deleted: false,
      };
    }

    args.where = whereClause;
    return args;
  }

  async findMany(props: TrackFindManyProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const options = this.findManyFilters(props);
      // console.log(logUtil(options));
      let queryOptions: Prisma.trackFindManyArgs = {
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

      const rawResults = await prisma.track.findMany(queryOptions);
      const entities = rawResults.map((rawResult) => {
        return Builder<TrackEntity>(TrackEntity, rawResult).build();
      });

      return entities;
    } catch (error) {
      throw error;
    }
  }

  async countMany(props: TrackFindManyProps, tx?: PrismaService) {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const queryOptions = this.findManyFilters(props);
      const result = await prisma.track.count({
        where: queryOptions.where,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
