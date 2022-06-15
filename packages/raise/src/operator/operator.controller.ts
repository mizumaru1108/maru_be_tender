import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { OperatorService } from './operator.service';

@ApiTags('operator')
@Controller('operator')
export class OperatorController {
  private logger = rootLogger.child({ logger: OperatorController.name });

  constructor(private operatorService: OperatorService) {}


  @ApiOperation({ summary: 'Get List All Operator' })
  @Get('getListAll')
  async getListAll() {
    this.logger.debug(`Get list all operator `);
    return await this.operatorService.getListAll();
  }

  @ApiOperation({ summary: 'Get Chart Data' })
  @Get(':operatorId/getChartData')
  async getChartData(@Param('operatorId') operatorId: string) {
    this.logger.debug(`Get Chart Data for operator ${operatorId}`);
    return await this.operatorService.getChartData(operatorId);
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
