import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProposalRegionEntity } from '../entities/proposal.region.entity';

export type ProposalRegionIncludeTypes = 'proposal' | 'region';

export class ProposalRegionCreateProps {
  proposal_region_id?: string;
  proposal_id: string;
  region_id: string;
}

export class ProposalRegionUpdateProps {
  proposal_region_id: string;
  proposal_id?: string;
  region_id?: string;
}

export class ProposalRegionFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: ProposalRegionIncludeTypes[];
}

@Injectable()
export class ProposalRegionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ProposalRegionCreateProps,
    session?: PrismaService,
  ): Promise<ProposalRegionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.proposalRegion.create({
        data: {
          proposal_region_id: props.proposal_region_id || nanoid(),
          region_id: props.region_id,
          proposal_id: props.proposal_id,
        },
      });

      const createdEntity = Builder<ProposalRegionEntity>(
        ProposalRegionEntity,
        {
          ...rawCreated,
        },
      ).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: ProposalRegionUpdateProps,
    session?: PrismaService,
  ): Promise<ProposalRegionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.proposalRegion.update({
        where: { proposal_region_id: props.proposal_region_id },
        data: {
          region_id: props.region_id,
          proposal_id: props.proposal_id,
        },
      });

      const updatedEntity = Builder<ProposalRegionEntity>(
        ProposalRegionEntity,
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

  applyInclude(include_relations: ProposalRegionIncludeTypes[]) {
    let include: Prisma.ProposalRegionInclude = {};
    for (const relation of include_relations) {
      if (relation === 'proposal') include.proposal = true;
      if (relation === 'region') include.region = true;
    }
    return include;
  }

  findManyFilter(props: ProposalRegionFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.ProposalRegionFindManyArgs = {};
    let whereClause: Prisma.ProposalRegionWhereInput = {};

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: ProposalRegionFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalRegionEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = this.findManyFilter(props);
      let queryOptions: Prisma.ProposalRegionFindManyArgs = {
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

      const rawResult = await prisma.proposalRegion.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<ProposalRegionEntity>(ProposalRegionEntity, {
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
    props: ProposalRegionFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = this.findManyFilter(props);
      return await prisma.proposalRegion.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
