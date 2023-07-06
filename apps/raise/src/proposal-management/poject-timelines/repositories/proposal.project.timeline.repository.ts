import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProposalProjectTimelineEntity } from '../entities/proposal.project.timeline.entity';

export class PoposalProjectTimelineCreateProps {
  id?: string; // optional incase for predefined id otherwise use uuidv4 as default
  proposal_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
}

export class PoposalProjectTimelineUpdateProps {}

export class PoposalProjectTimelineFindManyProps {
  proposal_id?: string;
  includes_relation?: string[];
  page?: number;
  limit?: number;
  filter?: string;
  sort_direction?: string;
  sort_by?: string;
}

@Injectable()
export class ProposalTimelinePostgresRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ProposalTimelinePostgresRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  update(
    props: PoposalProjectTimelineUpdateProps,
    session?: any,
  ): Promise<ProposalProjectTimelineEntity> {
    throw new Error('Method not implemented.');
  }

  findById(
    id: string,
    session?: any,
  ): Promise<ProposalProjectTimelineEntity | null> {
    throw new Error('Method not implemented.');
  }

  countMany(
    props: PoposalProjectTimelineFindManyProps,
    session?: any,
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async create(
    props: PoposalProjectTimelineCreateProps,
    session?: PrismaService,
  ): Promise<ProposalProjectTimelineEntity> {
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

      const createdTimelineEntity = Builder<ProposalProjectTimelineEntity>(
        ProposalProjectTimelineEntity,
        rawTimeline,
      ).build();

      return createdTimelineEntity;
    } catch (error) {
      this.logger.error(`error on create timeline ${error}`);
      throw error;
    }
  }

  async createMany(
    props: PoposalProjectTimelineCreateProps[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawResults = await prisma.project_timeline.createMany({
        data: props.map((prop: PoposalProjectTimelineCreateProps) => {
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

  async findManyItemBudgetFilter(props: PoposalProjectTimelineFindManyProps) {
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
    props: PoposalProjectTimelineFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalProjectTimelineEntity[]> {
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
        return Builder<ProposalProjectTimelineEntity>(
          ProposalProjectTimelineEntity,
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
