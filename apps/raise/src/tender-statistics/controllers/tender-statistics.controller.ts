import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { GetBudgetInfoDto } from '../dtos/requests/get-budget-info.dto';
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
  )
  @Get('budget-info')
  async getBudgetInfo(@Query() query: GetBudgetInfoDto) {
    const budgetInfo = await this.tenderStatisticsService.getBudgetInfo(query);
    return baseResponseHelper(budgetInfo, HttpStatus.OK, 'Budget Info');
  }
}
