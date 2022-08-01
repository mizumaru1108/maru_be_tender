import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  private logger = rootLogger.child({ logger: HrController.name });
  constructor(private hrService: HrService) {}

  @ApiOperation({ summary: 'Get HR List' })
  @Get('get/hr')
  async getAllProjects(): Promise<string> {
    this.logger.debug(`Fetching Hr List`);
    return await this.hrService.getListAll();
  }
}
