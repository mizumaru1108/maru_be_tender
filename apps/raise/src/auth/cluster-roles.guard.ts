import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICurrentUser } from '../user/interfaces/current-user.interface';

/**
 * RolesGuard
 * Used to check if the user has the required FusionAuth (cluster)-level roles to access a route.
 */
@Injectable()
export class ClusterRolesGuard implements CanActivate {
  /**
   * RolesGuard constructor.
   * @param reflector The reflector service.
   */
  constructor(
    private reflector: Reflector /*, private userService: UserService*/,
  ) {}

  /**
   * Set the roles for the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let currentUser: ICurrentUser = request.user;

    // FIXME: Hendy's note:
    // FusionAuth (cluster)-level roles are read directly from the JWT,
    // and does not hit the database at all, so no need to depend on UserService.
    // For organization-level roles, they're determined via Authzed,
    // which also in the initial authorization do not require database access,
    // but API call to Authzed instead.
    request.user = currentUser;
    const type = this.reflector.get<string[]>('type', context.getHandler());
    if (!type) {
      return true;
    }
    if (type.findIndex((value) => value == currentUser.type) > -1) {
      return true;
    } else {
      throw new ForbiddenException(
        "You don't have the required permissions to access this route",
      );
    }
  }
}
