import { Query, Controller, Get } from '@nestjs/common';
import { rootLogger } from '../logger';
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
}
