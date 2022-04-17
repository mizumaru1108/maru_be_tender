import { Controller, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('orgs/organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  async findAll() {
    return await this.organizationService.findAll();
  }
}
