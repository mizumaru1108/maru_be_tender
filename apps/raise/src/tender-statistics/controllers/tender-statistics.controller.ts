import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { AverageEmployeeTransactionTimeFilter } from '../dtos/requests/average-employee-transaction-time-filter';
import { BaseStatisticFilter } from '../dtos/requests/base-statistic-filter.dto';
import { GetAverageEmployeeResponseTime } from '../dtos/responses/get-average-employee-response-time.dto';
import { TenderStatisticsService } from '../services/tender-statistics.service';

@Controller('statistics')
export class TenderStatisticsController {
  constructor(
    private readonly tenderStatisticsService: TenderStatisticsService,
  ) {}

  @UseGuards(TenderJwtGuard)
  @Get('orders')
  async getAllStatistics(@Query() query: any) {
    const { from, to } = query;
    const allStatistics = await this.tenderStatisticsService.getAllStatistics(
      new Date(from),
      new Date(to),
    );
    return baseResponseHelper(
      allStatistics,
      HttpStatus.OK,
      'Tender Statistics',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('partners')
  async getAllPartnersStatistics(@Query() query: any) {
    const { from, to } = query;
    const allParntersStatistics =
      await this.tenderStatisticsService.getAllParntersStatistics(
        new Date(from),
        new Date(to),
      );
    return baseResponseHelper(
      allParntersStatistics,
      HttpStatus.OK,
      'Tender Statistics',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_portal_report',
  ) // only internal users
  @Get('partners-section')
  async getPartnersReport(@Query() query: BaseStatisticFilter) {
    const allParntersStatistics =
      await this.tenderStatisticsService.getPartnersStatistic(query);
    return baseResponseHelper(
      allParntersStatistics,
      HttpStatus.OK,
      'Beneficiaries Report Generated Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_portal_report',
  ) // only internal users
  @Get('benificiaries-report')
  async getProjectBeneficiariesReport(@Query() query: BaseStatisticFilter) {
    const allParntersStatistics =
      await this.tenderStatisticsService.getBeneficiariesReport(query);
    return baseResponseHelper(
      allParntersStatistics,
      HttpStatus.OK,
      'Beneficiaries Report Generated Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_portal_report',
  ) // only internal users
  @Get('average-track-transaction-time')
  async averageTransaction(@Query() query: BaseStatisticFilter) {
    const budgetInfo =
      await this.tenderStatisticsService.getTrackAverageTransaction(query);
    return baseResponseHelper(budgetInfo, HttpStatus.OK, 'Average transaction');
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_portal_report',
  ) // only internal users
  @Get('average-employee-transaction-time')
  async avarageEmployeeTransaction(
    @Query() filter: AverageEmployeeTransactionTimeFilter,
  ): Promise<ManualPaginatedResponse<GetAverageEmployeeResponseTime['data']>> {
    const response =
      await this.tenderStatisticsService.getEmployeeAverageTransaction(filter);

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_portal_report',
  ) // only internal users
  @Get('budget-info')
  async getBudgetInfo(@Query() query: BaseStatisticFilter) {
    const budgetInfo = await this.tenderStatisticsService.getBudgetInfo(query);
    return baseResponseHelper(budgetInfo, HttpStatus.OK, 'Budget Info');
  }
}
