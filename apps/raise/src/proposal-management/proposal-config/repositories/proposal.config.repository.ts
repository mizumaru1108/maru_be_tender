import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProposalConfigEntity } from '../entities/proposal.config.entity';

export type ProposalConfigIncludeTypes = '';

export class ProposalConfigUpdateProps {
  proposal_config_id: string;
  applying_status?: boolean;
  indicator_of_project_duration_days?: number;
  number_of_days_to_meet_business?: number;
  hieght_project_budget?: number;
  number_of_allowing_projects?: number;
  ending_date?: Date;
  starting_date?: Date;
}

export class ProposalConfigFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: ProposalConfigIncludeTypes[];
}

export class ProposalConfigFindFristProps {
  proposal_config_id?: string;
  include_relations?: ProposalConfigIncludeTypes[];
}

@Injectable()
export class ProposalConfigRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async update(
    props: ProposalConfigUpdateProps,
    session?: PrismaService,
  ): Promise<ProposalConfigEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.proposalConfigs.update({
        where: { proposal_config_id: props.proposal_config_id },
        data: {
          applying_status: props.applying_status,
          indicator_of_project_duration_days:
            props.indicator_of_project_duration_days,
          number_of_days_to_meet_business:
            props.number_of_days_to_meet_business,
          hieght_project_budget: props.hieght_project_budget,
          number_of_allowing_projects: props.number_of_allowing_projects,
          ending_date: props.ending_date,
          starting_date: props.starting_date,
        },
      });

      const updatedEntity = Builder<ProposalConfigEntity>(
        ProposalConfigEntity,
        {
          ...rawUpdated,
        },
      ).build();

      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  applyInclude(include_relations: ProposalConfigIncludeTypes[]) {
    // let include: Prisma.proposalconfig
    // for (const relation of include_relations) {
    //   // if (relation === 'proposal') include.proposal = true;
    //   // if (relation === 'governorate') {
    //   //   include.governorate = {
    //   //     include: {
    //   //       region_detail: true,
    //   //     },
    //   //   };
    //   // }
    // }
    // return include;
  }

  findFirstFilter(props: ProposalConfigFindFristProps) {
    const args: Prisma.ProposalConfigsFindFirstArgs = {};
    let whereClause: Prisma.ProposalConfigsWhereInput = {};

    if (props.proposal_config_id) {
      whereClause.proposal_config_id = props.proposal_config_id;
    }

    args.where = whereClause;

    if (props.include_relations && props.include_relations.length > 0) {
      // args.include = this.applyInclude(props.include_relations);
    }

    return args;
  }

  async findFirst(
    props: ProposalConfigFindFristProps,
    tx?: PrismaService,
  ): Promise<ProposalConfigEntity | null> {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const args = this.findFirstFilter(props);
      const rawRes = await prisma.proposalConfigs.findFirst({
        where: args.where,
        // include: args.include,
      });

      if (!rawRes) return null;

      const entity = Builder<ProposalConfigEntity>(
        ProposalConfigEntity,
        rawRes,
      ).build();
      return entity;
    } catch (err) {
      console.trace(err);
      throw err;
    }
  }

  findManyFilter(props: ProposalConfigFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.ProposalConfigsFindManyArgs = {};
    let whereClause: Prisma.ProposalConfigsWhereInput = {};

    // if (props.proposal_id) whereClause.proposal_id = props.proposal_id;

    if (include_relations && include_relations.length > 0) {
      // args.include = this.applyInclude(include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: ProposalConfigFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalConfigEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'proposal_config_id';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = this.findManyFilter(props);
      let queryOptions: Prisma.ProposalConfigsFindManyArgs = {
        where: args.where,
        // include: args.include,
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

      const rawResult = await prisma.proposalConfigs.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<ProposalConfigEntity>(ProposalConfigEntity, {
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
    props: ProposalConfigFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = this.findManyFilter(props);
      return await prisma.proposalConfigs.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
