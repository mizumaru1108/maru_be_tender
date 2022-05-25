import { Query, Controller, Get, Post, Body } from '@nestjs/common';
import { rootLogger } from '../logger';
import { ExpenseDto } from './dto/expense.dto';
import { ZakatService } from './zakat.service';

@Controller('zakat')
export class ZakatController {
  private logger = rootLogger.child({ logger: ZakatController.name });

  constructor(private zakatService: ZakatService) {}

  @Get('metal')
  async fetchingMetalPrice() {
    this.logger.debug('fetchingMetalPrice...');
    return await this.zakatService.fetchingMetalPrice();
  }

  @Get('metalprice')
  async getMetalPrice(
    @Query('base') base: string,
    @Query('symbols') symbols: string,
  ) {
    this.logger.debug(`getMetalPrice base=${base} symbols=${symbols}...`);
    return await this.zakatService.getMetalPrice(base, symbols);
  }

  @Get('transactionList')
  async getTransactionList(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching zakat transactions...');
    return await this.zakatService.getTransactionList(organizationId);
  }

  @Get('expense/list')
  async getExpenseList(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching expenses...');
    return await this.zakatService.getExpenseList(organizationId);
  }

  @Post('expense/create')
  async createExpense(@Body() expenseDto: ExpenseDto) {
    return await this.zakatService.createExpense(expenseDto);
  }
}
