import { Query, Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentRequestDto } from 'src/payment-stripe/payment-stripe.dto';
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

  @Get('getSummary')
  async getSummary(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching summary for zakat transaction...');
    return await this.zakatService.getSummary(organizationId);
  }

  @Get('transactionAll')
  async getTransactionAll(
    @Query('organizationId') organizationId: string,
    @Query('sortStatus') sortStatus: string,
  ) {
    this.logger.debug('fetching zakat transaction All...');
    return await this.zakatService.getTransactionAll(
      organizationId,
      sortStatus,
    );
  }

  @Get('transactionList')
  async getTransactionList(
    @Query('organizationId') organizationId: string,
    @Query('sortStatus') sortStatus: string,
  ) {
    this.logger.debug('fetching receive donation transaction...');
    return await this.zakatService.getTransactionList(
      organizationId,
      sortStatus,
    );
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

  @Post('donate')
  async createDonate(@Body() paymentDto: PaymentRequestDto) {
    return await this.zakatService.createDonate(paymentDto);
  }
}
