import { Controller, Get, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { rootLogger } from '../../logger';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
  private logger = rootLogger.child({ logger: VendorController.name });

  constructor(private vendorService: VendorService) {}

  @Get('/getListAll')
  async findAll() {
    this.logger.debug('findAll...');
    return await this.vendorService.findAll();
  }

  @ApiOperation({ summary: 'Get Vendor' })
  @Get(':vendorId')
  async getVendor(@Param('vendorId') vendorId: string) {
    this.logger.debug(`Get Vendor ${vendorId}`);
    return await this.vendorService.getVendor(vendorId);
  }

  @ApiOperation({ summary: 'Get Summary' })
  @Get(':vendorId/summary')
  async getSummary(@Param('vendorId') vendorId: string) {
    this.logger.debug(`Get Summary for vendor ${vendorId}`);
    return await this.vendorService.getSummary(vendorId);
  }

  @ApiOperation({ summary: 'Get Chart Data' })
  @Get(':vendorId/getChartData')
  async getChartData(@Param('vendorId') vendorId: string) {
    this.logger.debug(`Get Chart Data for vendor ${vendorId}`);
    return await this.vendorService.getChartData(vendorId);
    // const Income = [
    //   {
    //     name: 'Monthly',
    //     value: '4,900.50 SAR',
    //     data: [
    //       { name: 'Monthly', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
    //     ],
    //     categories: [
    //       'Jan',
    //       'Feb',
    //       'Mar',
    //       'Apr',
    //       'May',
    //       'Jun',
    //       'Jul',
    //       'Aug',
    //       'Sep',
    //     ],
    //   },
    //   {
    //     name: 'Daily (last 7 days)',
    //     value: '1,900.50 SAR', //sum amount of last 7 days
    //     chartData: [
    //       { name: 'Income1', data: [10, 41, 35, 51, 49, 62, 69, 91, 48] },
    //       { name: 'Income2', data: [10, 41, 35, 51, 49, 62, 69, 91, 48] },
    //     ],
    //     categories: ['1st', '2nd', '3rd', '4th', '5th', '6th ', '7th'],
    //   },
    // ];
    //
    // const Campaign = [
    //   {
    //     name: 'Monthly',
    //     value: '$4,900.50',
    //     data: [
    //       { name: 'Monthly', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
    //     ],
    //     categories: [
    //       'Jan',
    //       'Feb',
    //       'Mar',
    //       'Apr',
    //       'May',
    //       'Jun',
    //       'Jul',
    //       'Aug',
    //       'Sep',
    //     ],
    //   },
    //   {
    //     name: 'Daily (last 7 days)',
    //     value: '2,500.00 SAR',
    //     chartData: [
    //       { name: 'Campaign1', data: [10, 41, 35, 51, 49, 62, 69, 91, 48] },
    //       { name: 'Campaign2', data: [15, 21, 65, 11, 44, 42, 59, 71, 18] },
    //     ],
    //     categories: ['1st', '2nd', '3rd', '4th', '5th', '6th ', '7th'],
    //   },
    // ];
    //
    // return {
    //   Income,
    //   Campaign,
    // };
  }
}