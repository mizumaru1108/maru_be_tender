import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProposalGovernorateEntity } from '../entities/proposal.governorate.entity';

export type ProposalGovernorateIncludeTypes = 'proposal' | 'governorate';

export class ProposalGovernorateCreateProps {
  proposal_governorate_id?: string;
  proposal_id: string;
  governorate_id: string;
}

export class ProposalGovernorateUpdateProps {
  proposal_governorate_id: string;
  proposal_id?: string;
  governorate_id?: string;
}

export class ProposalGovernorateFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: ProposalGovernorateIncludeTypes[];
}

@Injectable()
export class ProposalGovernorateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ProposalGovernorateCreateProps,
    session?: PrismaService,
  ): Promise<ProposalGovernorateEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.proposalGovernorate.create({
        data: {
          proposal_governorate_id: props.proposal_governorate_id || nanoid(),
          governorate_id: props.governorate_id,
          proposal_id: props.proposal_id,
        },
      });

      const createdEntity = Builder<ProposalGovernorateEntity>(
        ProposalGovernorateEntity,
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
    props: ProposalGovernorateUpdateProps,
    session?: PrismaService,
  ): Promise<ProposalGovernorateEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.proposalGovernorate.update({
        where: { proposal_governorate_id: props.proposal_governorate_id },
        data: {
          governorate_id: props.governorate_id,
          proposal_id: props.proposal_id,
        },
      });

      const updatedEntity = Builder<ProposalGovernorateEntity>(
        ProposalGovernorateEntity,
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

  applyInclude(include_relations: ProposalGovernorateIncludeTypes[]) {
    let include: Prisma.ProposalGovernorateInclude = {};
    for (const relation of include_relations) {
      if (relation === 'proposal') include.proposal = true;
      if (relation === 'governorate') {
        include.governorate = {
          include: {
            region_detail: true,
          },
        };
      }
    }
    return include;
  }

  findManyFilter(props: ProposalGovernorateFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.ProposalGovernorateFindManyArgs = {};
    let whereClause: Prisma.ProposalGovernorateWhereInput = {};

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: ProposalGovernorateFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalGovernorateEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = this.findManyFilter(props);
      let queryOptions: Prisma.ProposalGovernorateFindManyArgs = {
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

      const rawResult = await prisma.proposalGovernorate.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<ProposalGovernorateEntity>(ProposalGovernorateEntity, {
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
    props: ProposalGovernorateFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = this.findManyFilter(props);
      return await prisma.proposalGovernorate.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
