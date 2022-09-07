import { Relationship } from '@authzed/authzed-node/dist/src/v1';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { Permission } from '../libs/authzed/enums/permission.enum';
import { UpsertUserPermission } from './dto/upsert-user-permission.dto';
import { PermissionManagerService } from './permission-manager.service';

@Controller('permission-manager')
export class PermissionManagerController {
  constructor(
    private readonly permissionManagerService: PermissionManagerService,
  ) {}

  @Permissions(Permission.PM)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('assign/operator')
  async assignOperator(
    @Body() request: UpsertUserPermission,
  ): Promise<BaseResponse<Relationship>> {
    const response =
      await this.permissionManagerService.grantOperatorPermission(request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      `Successfully modified operator permission for ${request.userId} to organization ${request.organizationId} !`,
    );
  }

  @Permissions(Permission.PM)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('assign/vendor')
  async assignVendor(
    @Body() request: UpsertUserPermission,
  ): Promise<BaseResponse<Relationship>> {
    const response = await this.permissionManagerService.grantVendorPermission(
      request,
    );
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      `Successfully modified vendor permission for ${request.userId} to organization ${request.organizationId} !`,
    );
  }
}
