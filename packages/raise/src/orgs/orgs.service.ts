import { Injectable } from '@nestjs/common';
import { OrganizationModel } from './schema/organization.schema';

@Injectable()
export class OrgsService {
  constructor() {}

  async findAll() {
    return await OrganizationModel.find({}, {}, { sort: { name: 1 } });
  }
}
