import { Module } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { OrgsController } from './orgs.controller';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';

@Module({
  providers: [OrgsService, OrganizationService],
  controllers: [OrgsController, OrganizationController],
})
export class OrgsModule {}
