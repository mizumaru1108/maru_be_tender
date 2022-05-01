import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthzedService } from 'src/authzed/authzed.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzedService: AuthzedService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [namespace, permission] = this.reflector.get<string>('permission', context.getHandler());

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const resourceId = request.params.id || 'all';
    const userId = request.user.userId;

    const resource = await this.authzedService.createResourceReference(namespace, resourceId);

    const userRef = await this.authzedService.createResourceReference('user', userId);
    const subject = await this.authzedService.createSubjectReference(userRef);

    let result = await this.authzedService.checkPermission(
      resource,
      subject,
      permission
    );

    return result;
  }
}