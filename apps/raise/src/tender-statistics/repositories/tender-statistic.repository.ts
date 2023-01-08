import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { BaseStatisticFilter } from '../dtos/requests/base-statistic-filter.dto';
import { GetBudgetInfoDto } from '../dtos/requests/get-budget-info.dto';
import { GetRawBeneficiariesDataResponseDto } from '../dtos/responses/get-raw-beneficiaries-data-response.dto';
import { GetRawPartnerDatasResponseDto } from '../dtos/responses/get-raw-partner-datas.dto';
import { GetRawStatusDatasResponseDto } from '../dtos/responses/get-raw-status.datas.dto';

@Injectable()
export class TenderStatisticsRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderStatisticsRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async getRawBeneficiariesData(
    filter: BaseStatisticFilter,
  ): Promise<GetRawBeneficiariesDataResponseDto[]> {
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

    try {
      return await this.prismaService.proposal.findMany({
        where: {
          ...query,
          project_track: {
            not: null,
            notIn: ['GENERAL', 'DEFAULT_TRACK'],
          },
          project_manager_id: {
            not: null,
          },
          supervisor_id: {
            not: null,
          },
          outter_status: {
            not: null,
            notIn: ['CANCELLED', 'REJECTED'],
          },
        },
        select: {
          project_track: true,
          num_ofproject_binicficiaries: true,
          project_beneficiaries: true,
        },
      });
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

  async getRawPartnersData(
    filter: BaseStatisticFilter,
  ): Promise<GetRawPartnerDatasResponseDto[]> {
    try {
      const { start_date, end_date } = filter;
      let query: Prisma.userWhereInput = {};

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

      const partners = await this.prismaService.user.findMany({
        where: {
          ...query,
          roles: {
            some: {
              user_type_id: 'CLIENT',
            },
          },
        },
        select: {
          roles: {
            select: {
              user_type_id: true,
            },
          },
          status: {
            select: {
              id: true,
            },
          },
          client_data: {
            select: {
              governorate: true,
              region: true,
            },
          },
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return partners;
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

  async getRawUserStatus(): Promise<GetRawStatusDatasResponseDto[]> {
    try {
      return await this.prismaService.user_status.findMany({
        select: {
          id: true,
        },
      });
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
        created_at: Date | null;
        updated_at: Date | null;
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
              created_at: true,
              updated_at: true,
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
