import { Controller, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { rootLogger } from '../logger';

@Controller('orgs/getListAll')
export class OrganizationController {
  private logger = rootLogger.child({ logger: OrganizationController.name });

  constructor(private organizationService: OrganizationService) {}

  @Get()
  async findAll() {
    this.logger.debug('findAll...');
    return await this.organizationService.findAll();
    // return { message: 'hello' };
  }
}
