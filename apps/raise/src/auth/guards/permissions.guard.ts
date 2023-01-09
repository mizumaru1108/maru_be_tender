import {
  CheckPermissionResponse_Permissionship,
  ObjectReference,
  SubjectReference,
} from '@authzed/authzed-node/dist/src/v1';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthzedService } from 'src/libs/authzed/authzed.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzedService: AuthzedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      throw new BadRequestException('No permissions defined!');
    }
    // console.log('requested permission', permissions);

    const request = context.switchToHttp().getRequest();

    // get organizationid
    let organizationId = '';
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      organizationId = request.body.organizationId;
    }
    if (request.method === 'GET') {
      organizationId = request.query.organizationId;
    }
    if (request.method === 'DELETE') {
      organizationId = request.params.organizationId;
    }

    // console.log('organizationId', organizationId);
    if (
      organizationId === '' ||
      organizationId === undefined ||
      organizationId === null ||
      !organizationId
    ) {
      throw new BadRequestException(
        'No organizationId defined!, please add "organizationid" to header!',
      );
    }

    const userId = request.user.id;
    if (!userId) {
      throw new BadRequestException('No user found, please login first!');
    }
    // console.log('userId', userId);

    const refrence: ObjectReference = {
      objectType: 'tmra_staging/organization',
      objectId: `${organizationId}`,
    };

    const subject: SubjectReference = {
      object: {
        objectType: 'tmra_staging/user',
        objectId: `${userId}`,
      },
      optionalRelation: '',
    };

    const isAllowed = await this.authzedService.checkPermissions(
      refrence,
      subject,
      permissions[0],
    );
    // console.log('isAllowed', isAllowed);

    if (
      !isAllowed ||
      isAllowed.permissionship !==
        CheckPermissionResponse_Permissionship.HAS_PERMISSION
    ) {
      throw new ForbiddenException(
        'You are not authorized to perform this action!',
      );
    }

    return true;
  }
}
