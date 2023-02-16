import { Injectable } from '@nestjs/common';
import { AuthzedService } from '../libs/authzed/authzed.service';
import { AuthzedRelationship } from '../libs/authzed/enums/relationship.enum';
import { UpsertUserPermission } from './dto/upsert-user-permission.dto';

@Injectable()
export class PermissionManagerService {
  constructor(private readonly authzedService: AuthzedService) {}

  async grantOperatorPermission(request: UpsertUserPermission) {
    const response = await this.authzedService.createRelationship(
      request.organizationId,
      request.userId,
      AuthzedRelationship.OPERATOR,
    );
    return response;
  }

  async grantVendorPermission(request: UpsertUserPermission) {
    const response = await this.authzedService.createRelationship(
      request.organizationId,
      request.userId,
      AuthzedRelationship.VENDOR,
    );
    return response;
  }

  async grantNonprofitPermission(request: UpsertUserPermission) {
    const response = await this.authzedService.createRelationship(
      request.organizationId,
      request.userId,
      AuthzedRelationship.NONPROFIT,
    );
    return response;
  }
}
