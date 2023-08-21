import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProposalAskedEditRequestEntity } from '../entities/proposal.asked.edit.request.entity';
import { v4 as uuidv4 } from 'uuid';
import { OutterStatusEnum } from '../../../tender-commons/types/proposal';

export class ProposalAskedEditRequestCreateProps {
  id?: string;
  notes: string;
  sender_id: string;
  sender_role: string;
  supervisor_id: string;
  proposal_id: string;
}

export class ProposalAskedEditRequestUpdateProps {}

export class ProposalAskedEditRequestFindManyProps {
  include_relations?: string[];
  status?: string;
  project_name?: string;
  employee_name?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ProposalAskedEditRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ProposalAskedEditRequestCreateProps,
    session?: PrismaService,
  ): Promise<ProposalAskedEditRequestEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.proposal_asked_edit_request.create({
        data: {
          id: props.id || uuidv4(),
          notes: props.notes,
          sender_id: props.sender_id,
          sender_role: props.sender_role,
          proposal_id: props.proposal_id,
          supervisor_id: props.supervisor_id,
        },
      });

      const createdEntity = Builder<ProposalAskedEditRequestEntity>(
        ProposalAskedEditRequestEntity,
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

  // async update(
  //   props: ProposalAskedEditRequestUpdateProps,
  //   session?: PrismaService,
  // ): Promise<ProposalAskedEditRequestEntity> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const rawUpdated = await prisma.proposal_asked_edit_request.update({
  //       where: {},
  //       data: {},
  //     });

  //     const updatedEntity = Builder<ProposalAskedEditRequestEntity>(
  //       ProposalAskedEditRequestEntity,
  //       {
  //         ...rawUpdated,
  //       },
  //     ).build();
  //     return updatedEntity;
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  // async findById(
  //   id: string,
  //   session?: PrismaService,
  // ): Promise<ProposalAskedEditRequestEntity | null> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const result = await prisma.proposalAskedEditRequest.findFirst({
  //       where: { id: id },
  //     });
  //     if (!result) return null;
  //     return Builder<ProposalAskedEditRequestEntity>(
  //       ProposalAskedEditRequestEntity,
  //       {
  //         ...result,
  //       },
  //     ).build();
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  async findManyFilters(props: ProposalAskedEditRequestFindManyProps) {
    const { status, employee_name, project_name, include_relations } = props;
    let queryOptions: Prisma.proposal_asked_edit_requestFindManyArgs = {};
    let findManyWhereClause: Prisma.proposal_asked_edit_requestWhereInput = {};

    if (employee_name) {
      findManyWhereClause = {
        ...findManyWhereClause,
        sender: {
          employee_name: {
            contains: employee_name,
            mode: 'insensitive',
          },
        },
      };
    }

    if (project_name) {
      findManyWhereClause = {
        ...findManyWhereClause,
        proposal: {
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        },
      };
    }

    if (status) {
      findManyWhereClause = {
        ...findManyWhereClause,
        status,
      };
    }

    findManyWhereClause = {
      ...findManyWhereClause,
      proposal: {
        outter_status: {
          in: [
            OutterStatusEnum.ASKED_FOR_AMANDEMENT,
            OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT,
          ],
        },
      },
    };
    if (include_relations && include_relations.length > 0) {
      let include: Prisma.proposal_asked_edit_requestInclude = {};

      for (const relation of include_relations) {
        if (relation === 'proposal') {
          include = {
            ...include,
            proposal: true,
          };
        }
        if (relation === 'sender') {
          include = {
            ...include,
            sender: true,
          };
        }
        if (relation === 'supervisor') {
          include = {
            ...include,
            supervisor: true,
          };
        }
      }

      queryOptions.include = include;
    }

    queryOptions.where = findManyWhereClause;
    return queryOptions;
  }

  async findMany(
    props: ProposalAskedEditRequestFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalAskedEditRequestEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      let args = await this.findManyFilters(props);
      let queryOptions: Prisma.proposal_asked_edit_requestFindManyArgs = {
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

      const rawEntities = await prisma.proposal_asked_edit_request.findMany(
        queryOptions,
      );

      const entities = rawEntities.map((rawEntities) => {
        return Builder<ProposalAskedEditRequestEntity>(
          ProposalAskedEditRequestEntity,
          {
            ...rawEntities,
          },
        ).build();
      });

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: ProposalAskedEditRequestFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const queryOptions = await this.findManyFilters(props);
      const result = await prisma.proposal_asked_edit_request.count({
        where: queryOptions.where,
      });
      return result;
    } catch (error) {
      // throw this.errorMapper(error);
      console.trace(error);
      throw error;
    }
  }
}
