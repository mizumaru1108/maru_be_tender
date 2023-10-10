import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { TrackEntity } from '../entities/track.entity';
import { TrackMapper } from '../mapper/track.mapper';
import { PaymentStatusEnum } from '../../../proposal-management/payment/types/enums/payment.status.enum';

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

export enum TrackIncludeRelationsTypeEnum {
  PROPOSAL = 'proposal',
  TRACK_SECTIONS = 'track_sections',
}

export type TrackIncludeRelationsTypes = 'proposal' | 'track_sections';
export class TrackFindFirstProps {
  id?: string;
  name?: string;
  exclude_id?: string;
  budget_info?: '0' | '1';
  include_relations?: TrackIncludeRelationsTypes[];
}

export class TrackFindManyProps {
  track_name?: string;
  include_general?: '1' | '0';
  is_deleted?: '1' | '0';
  budget_info?: '0' | '1';
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: TrackIncludeRelationsTypes[];
}

@Injectable()
export class TrackRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TrackRepository.name,
  });
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trackMapper: TrackMapper,
  ) {}

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

  applyInclude(include_relations: TrackIncludeRelationsTypes[]) {
    let include: Prisma.trackInclude = {};
    // console.log({ include_relations });
    for (const relation of include_relations) {
      if (relation === 'proposal') {
        include = {
          ...include,
          proposal: {
            select: {
              id: true,
              track_id: true,
              fsupport_by_supervisor: true,
              payments: {
                include: {
                  cheques: true,
                },
              },
            },
          },
        };
      }

      if (relation === 'track_sections') {
        include = {
          ...include,
          track_section: {
            where: {
              parent_section_id: null,
            },
            include: {
              child_track_section: {
                include: {
                  child_track_section: {
                    include: {
                      child_track_section: {
                        include: {
                          child_track_section: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
      }
    }
    return include;
  }

  findFirstFilter(props: TrackFindFirstProps) {
    const args: Prisma.trackFindFirstArgs = {};
    let whereClause: Prisma.trackWhereInput = {};

    if (props.id) whereClause.id = props.id;
    if (props.name) whereClause.name = props.name;
    if (props.exclude_id) whereClause.id = { notIn: [props.exclude_id] };

    if (props.budget_info) {
      if (props.include_relations) {
        props.include_relations.push('proposal');
      } else {
        props.include_relations = ['proposal'];
      }
    }

    args.where = whereClause;

    if (props.include_relations && props.include_relations.length > 0) {
      args.include = this.applyInclude(props.include_relations);
    }

    return args;
  }

  async findFirst(
    props: TrackFindFirstProps,
    tx?: PrismaService,
  ): Promise<TrackEntity | null> {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const args = this.findFirstFilter(props);
      const rawTrack = await prisma.track.findFirst({
        where: args.where,
        include: args.include,
      });

      if (!rawTrack) return null;

      const entity = this.trackMapper.toDomain(rawTrack);
      return entity;
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

    if (props.include_relations && props.include_relations.length > 0) {
      args.include = this.applyInclude(props.include_relations);
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

      const entities = this.trackMapper.toDomainList(rawResults);
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
