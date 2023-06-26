import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { Builder } from 'builder-pattern';
import { Prisma } from '@prisma/client';
import { ProjectTimelineEntity } from '../entities/project-timeline.entity';

export class CreateTimelinePropos {
  id?: string; // optional incase for predefined id otherwise use uuidv4 as default
  proposal_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
}

export interface FindManyTimelineProps {
  proposal_id?: string;
  includes_relation?: string[];
  page?: number;
  limit?: number;
  filter?: string;
  sort_direction?: string;
  sort_by?: string;
}

@Injectable()
export class TenderProposalTimelineRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalTimelineRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: CreateTimelinePropos,
    session?: PrismaService,
  ): Promise<ProjectTimelineEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawTimeline = await prisma.project_timeline.create({
        data: {
          id: props.id || uuidv4(),
          proposal_id: props.proposal_id,
          name: props.name,
          start_date: props.start_date,
          end_date: props.end_date,
        },
      });

      const createdTimelineEntity = Builder<ProjectTimelineEntity>(
        ProjectTimelineEntity,
        rawTimeline,
      ).build();

      return createdTimelineEntity;
    } catch (error) {
      this.logger.error(`error on create timeline ${error}`);
      throw error;
    }
  }

  async createMany(
    props: CreateTimelinePropos[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawResults = await prisma.project_timeline.createMany({
        data: props.map((prop: CreateTimelinePropos) => {
          return {
            id: prop.id || uuidv4(),
            proposal_id: prop.proposal_id,
            name: prop.name,
            start_date: prop.start_date,
            end_date: prop.end_date,
          };
        }),
      });

      return rawResults.count;
    } catch (error) {
      this.logger.info(`error on create many item budget ${error}`);
      throw error;
    }
  }

  async findManyItemBudgetFilter(props: FindManyTimelineProps) {
    const { proposal_id } = props;
    let args: Prisma.project_timelineFindManyArgs = {};
    let whereClause: Prisma.project_timelineWhereInput = {};

    if (proposal_id) {
      whereClause = {
        ...whereClause,
        proposal_id,
      };
    }
    args.where = whereClause;

    return args;
  }

  async findMany(
    props: FindManyTimelineProps,
    session?: PrismaService,
  ): Promise<ProjectTimelineEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const args = await this.findManyItemBudgetFilter(props);
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      let queryOptions: Prisma.project_timelineFindManyArgs = {
        ...args,
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

      const rawTimelines = await prisma.project_timeline.findMany(queryOptions);

      const timelineEntities = rawTimelines.map((timeline) => {
        return Builder<ProjectTimelineEntity>(
          ProjectTimelineEntity,
          timeline,
        ).build();
      });

      return timelineEntities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
