import { Controller, Get } from '@nestjs/common';
import { OrgsService } from './orgs.service';

@Controller('orgs')
export class OrgsController {
  constructor(private orgsService: OrgsService) {}

  @Get()
  async findAll() {
    return await this.orgsService.findAll();
  }
}
