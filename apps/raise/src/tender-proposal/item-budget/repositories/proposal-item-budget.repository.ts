import { Injectable } from '@nestjs/common';
import { ProposalItemBudgetEntity } from '../entities/proposal_item_budget.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { Builder } from 'builder-pattern';
import { Prisma } from '@prisma/client';

export class CreateItemBugetProps {
  id?: string; // optional incase for predefined id otherwise use uuidv4 as default
  proposal_id: string;
  amount: number;
  clause: string;
  explanation: string;
}

export interface FindManyItemBudgetProps {
  proposal_id?: string;
  includes_relation?: string[];
  page?: number;
  limit?: number;
  filter?: string;
  sort_direction?: string;
  sort_by?: string;
}

@Injectable()
export class TenderProposalItemBudgetRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalItemBudgetRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: CreateItemBugetProps,
    session?: PrismaService,
  ): Promise<ProposalItemBudgetEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedItemBudget = await prisma.proposal_item_budget.create({
        data: {
          id: props.id || uuidv4(),
          amount: props.amount,
          clause: props.clause,
          explanation: props.explanation,
          proposal_id: props.proposal_id,
        },
      });

      const createdItemBudgetEntity = Builder<ProposalItemBudgetEntity>(
        ProposalItemBudgetEntity,
        {
          ...rawCreatedItemBudget,
          amount: parseFloat(rawCreatedItemBudget.amount.toString()),
        },
      ).build();

      return createdItemBudgetEntity;
    } catch (error) {
      this.logger.error(`error on create item budget ${error}`);
      throw error;
    }
  }

  async createMany(
    props: CreateItemBugetProps[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawResults = await prisma.proposal_item_budget.createMany({
        data: props.map((prop) => {
          return {
            id: prop.id || uuidv4(),
            amount: prop.amount,
            clause: prop.clause,
            explanation: prop.explanation,
            proposal_id: prop.proposal_id,
          };
        }),
      });

      return rawResults.count;
    } catch (error) {
      this.logger.info(`error on create many item budget ${error}`);
      throw error;
    }
  }

  async findManyItemBudgetFilter(props: FindManyItemBudgetProps) {
    const { proposal_id } = props;
    let args: Prisma.proposal_item_budgetFindManyArgs = {};
    let whereClause: Prisma.proposal_item_budgetWhereInput = {};

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
    props: FindManyItemBudgetProps,
    session?: PrismaService,
  ): Promise<ProposalItemBudgetEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const args = await this.findManyItemBudgetFilter(props);
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      let queryOptions: Prisma.proposal_item_budgetFindManyArgs = {
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

      // console.log(logUtil(queryOptions));
      const rawItemBudgets = await prisma.proposal_item_budget.findMany(
        queryOptions,
      );

      const itemBudgets = rawItemBudgets.map((rawLog) => {
        return Builder<ProposalItemBudgetEntity>(ProposalItemBudgetEntity, {
          ...rawLog,
          amount: parseFloat(rawLog.amount.toString()),
        }).build();
      });

      return itemBudgets;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
