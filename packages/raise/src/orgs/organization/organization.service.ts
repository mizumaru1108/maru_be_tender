import { Injectable } from '@nestjs/common';
import { OrganizationModel } from '../schema/organization.schema';
import { rootLogger } from '../../logger';

@Injectable()
export class OrganizationService {
  private logger = rootLogger.child({ logger: OrganizationService.name });

  async findAll() {
    this.logger.debug('findAll...');
    return await OrganizationModel.find({}, {}, { sort: { name: 1 } });
  }
}
