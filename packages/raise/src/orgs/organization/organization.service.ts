import { Injectable } from '@nestjs/common';
import { OrganizationModel } from '../schema/organization.schema';

@Injectable()
export class OrganizationService {
  async findAll() {
    return await OrganizationModel.find({}, {}, { sort: { name: 1 } });
  }
}
