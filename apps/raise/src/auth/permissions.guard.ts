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

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private authzedService: AuthzedService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const [namespace, permission] = this.reflector.get<string>(
//       'permission',
//       context.getHandler(),
//     );

//     if (!permission) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();

//     const resourceId = request.params.id || 'all';
//     const userId = request.user.userId;

//     const resource = await this.authzedService.createResourceReference(
//       namespace,
//       resourceId,
//     );

//     const userRef = await this.authzedService.createResourceReference(
//       'user',
//       userId,
//     );
//     const subject = await this.authzedService.createSubjectReference(userRef);

//     let result = await this.authzedService.checkPermission(
//       resource,
//       subject,
//       permission,
//     );

//     return result;
//   }
// }
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

    //get organizationId from request.body
    const request = context.switchToHttp().getRequest();

    // if request is POST, organizationId is in body
    // else organizationId is in params
    console.log('request.body', request.body);
    console.log('request.params', request.params);
    console.log(request.method);
    let organizationId: string = '';
    if (request.method === 'POST') {
      organizationId = request.body.organizationId;
    } else {
      organizationId = request.params.organizationId;
    }
    console.log('organizationId', organizationId);
    if (organizationId === '' || organizationId === undefined) {
      throw new BadRequestException('No organizationId defined!');
    }

    //get userId from request.user
    const userId = request.user.id;
    if (!userId) {
      throw new BadRequestException('No user found, please login first!');
    }

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

    if (
      !isAllowed ||
      isAllowed.permissionship ===
        CheckPermissionResponse_Permissionship.NO_PERMISSION ||
      isAllowed.permissionship ===
        CheckPermissionResponse_Permissionship.UNSPECIFIED
    ) {
      throw new ForbiddenException(
        'You are not authorized to perform this action!',
      );
    }

    return true;
  }
}
