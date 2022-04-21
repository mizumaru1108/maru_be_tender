import { Controller, Get, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { rootLogger } from '../logger';

@Controller('vendor')
export class VendorController {
  private logger = rootLogger.child({ logger: VendorController.name });

  constructor(private vendorService: VendorService) {}

  @Get('/getListAll')
  async findAll() {
    this.logger.debug('findAll...');
    return await this.vendorService.findAll();
  }

  @Get(':vendorId/getChartData')
  async getChartData(){
    return ({
        "a" : "100",
        "b" : "200"
    })
  }
}
