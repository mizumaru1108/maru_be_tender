import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Sql } from '@prisma/client/runtime';
import moment from 'moment';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { AverageEmployeeTransactionTimeFilter } from '../dtos/requests/average-employee-transaction-time-filter';
import { BaseStatisticFilter } from '../dtos/requests/base-statistic-filter.dto';
import { GetRawAverageEmployeeResponseTime } from '../dtos/responses/get-raw-average-employee-response-time.dto';
import { GetRawTrackAverageTransaction } from '../dtos/responses/get-raw-average-transaction.dto';
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
    try {
      return await this.prismaService.proposal.findMany({
        where: {
          created_at: {
            gte: moment(start_date).startOf('day').toDate(),
            lte: moment(end_date).endOf('day').toDate(),
          },
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

      const partners = await this.prismaService.user_status_log.findMany({
        where: {
          created_at: {
            gte: moment(start_date).startOf('day').toDate(),
            lte: moment(end_date).endOf('day').toDate(),
          },
          user_detail: {
            roles: {
              some: {
                user_type_id: 'CLIENT',
              },
            },
          },
        },
        select: {
          user_detail: {
            select: {
              id: true,
              client_data: {
                select: {
                  governorate: true,
                  region: true,
                },
              },
              roles: {
                select: {
                  user_type_id: true,
                },
              },
            },
          },
          user_status: {
            select: {
              id: true,
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

  async getBudgetInfo(filter: BaseStatisticFilter): Promise<
    {
      id: string;
      fsupport_by_supervisor: Prisma.Decimal | null;
      amount_required_fsupport: Prisma.Decimal | null;
      number_of_payments: Prisma.Decimal | null;
      number_of_payments_by_supervisor: Prisma.Decimal | null;
      whole_budget: Prisma.Decimal | null;
      project_track: string | null;
      proposal_item_budgets: {
        id: string;
        amount: Prisma.Decimal | null;
        created_at: Date | null;
        updated_at: Date | null;
      }[];
    }[]
  > {
    try {
      const { start_date, end_date } = filter;

      const budgetInfo = await this.prismaService.proposal.findMany({
        where: {
          created_at: {
            gte: moment(start_date).startOf('day').toDate(),
            lte: moment(end_date).endOf('day').toDate(),
          },
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
          id: true,
          fsupport_by_supervisor: true,
          amount_required_fsupport: true,
          number_of_payments: true,
          number_of_payments_by_supervisor: true,
          whole_budget: true,
          project_track: true,
          proposal_item_budgets: {
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

  async getTrackAverageTransaction(
    filter: BaseStatisticFilter,
  ): Promise<GetRawTrackAverageTransaction['data']> {
    try {
      const { start_date, end_date } = filter;

      const rawExecutionTime = await this.prismaService.proposal_log.findMany({
        where: {
          created_at: {
            gte: moment(start_date).startOf('day').toDate(),
            lte: moment(end_date).endOf('day').toDate(),
          },
          proposal: {
            project_track: {
              not: null,
              notIn: ['GENERAL', 'DEFAULT_TRACK'],
            },
          },
          response_time: {
            not: null,
          },
        },
        select: {
          proposal: {
            select: {
              project_track: true,
            },
          },
          proposal_id: true,
          response_time: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return rawExecutionTime;
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

  async getEmployeeAverageTransaction(
    filter: AverageEmployeeTransactionTimeFilter,
  ): Promise<GetRawAverageEmployeeResponseTime[]> {
    try {
      const {
        start_date,
        end_date,
        limit = 10,
        page = 1,
        employee_name,
      } = filter;
      const offset = (page - 1) * limit;

      let whereClause: Sql = Prisma.sql`
        proposal_log.created_at >= to_timestamp(${moment(start_date)
          .startOf('day')
          .toISOString()}, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
        AND proposal_log.created_at <= to_timestamp(${moment(end_date)
          .startOf('day')
          .toISOString()}, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
        AND proposal.project_track NOT IN ('GENERAL', 'DEFAULT_TRACK')
        AND proposal_log.response_time IS NOT NULL`;

      if (employee_name && employee_name !== '') {
        whereClause = Prisma.sql`${whereClause} AND employee_name LIKE '%' || ${employee_name} || '%'`;
      }

      // console.log({ whereClause });
      return await this.prismaService.$queryRaw`
      SELECT
          MIN(reviewer.id) as id,
          MIN(reviewer.employee_name) as employee_name,
          MIN(proposal_log.user_role) as account_type,
          MIN(proposal.project_track) as section,
          COUNT(proposal_log.id) as total_transaction,
          SUM(proposal_log.response_time) AS response_time,
          AVG(proposal_log.response_time) AS average_response_time,
          COUNT(*) over() as total
        FROM
          proposal_log
          LEFT JOIN
          "user" AS reviewer ON proposal_log.reviewer_id = reviewer.id
          LEFT JOIN proposal ON proposal_log.proposal_id = proposal.id
        WHERE
          ${whereClause}
        GROUP BY
          proposal.project_track,
          proposal_log.user_role
        ORDER BY
          total_transaction DESC,
          average_response_time ASC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
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

  async fetchAllTrack() {
    try {
      return await this.prismaService.project_tracks.findMany({
        where: {
          id: {
            notIn: ['GENERAL', 'DEFAULT_TRACK'],
          },
        },
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderStatisticsRepository.name,
        'findingTrack Error:',
        `finding track!`,
      );
      throw theError;
    }
  }
}
