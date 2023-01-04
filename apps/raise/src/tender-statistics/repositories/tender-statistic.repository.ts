import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { GetBudgetInfoDto } from '../dtos/requests/get-budget-info.dto';

@Injectable()
export class TenderStatisticsRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderStatisticsRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async getBudgetInfo(filter: GetBudgetInfoDto): Promise<
    {
      id: string;
      fsupport_by_supervisor: Prisma.Decimal | null;
      amount_required_fsupport: Prisma.Decimal | null;
      number_of_payments: Prisma.Decimal | null;
      number_of_payments_by_supervisor: Prisma.Decimal | null;
      whole_budget: Prisma.Decimal | null;
      project_track: string | null;
      proposal_item_budget: {
        id: string;
        amount: Prisma.Decimal | null;
      }[];
    }[]
  > {
    try {
      const { start_date, end_date } = filter;
      let query: Prisma.proposalWhereInput = {};

      if (start_date) {
        query = {
          ...query,
          created_at: {
            gte: new Date(start_date),
          },
        };
      }

      if (end_date) {
        query = {
          ...query,
          created_at: {
            lte: new Date(end_date),
          },
        };
      }

      const budgetInfo = await this.prismaService.proposal.findMany({
        where: {
          ...query,
          project_track: {
            not: null,
          },
        },
        select: {
          id: true,
          fsupport_by_supervisor: true,
          amount_required_fsupport: true,
          number_of_payments: true,
          number_of_payments_by_supervisor: true,
          whole_budget: true,
          project_track: true,
          proposal_item_budget: {
            select: {
              id: true,
              amount: true,
            },
          },
        },
      });
      return budgetInfo;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderStatisticsRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }
}
