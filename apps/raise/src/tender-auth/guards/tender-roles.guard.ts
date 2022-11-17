import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard
 * Used to check if the user has the required FusionAuth (cluster)-level roles to access a route.
 */
@Injectable()
export class TenderRolesGuard implements CanActivate {
  /**
   * RolesGuard constructor.https://acefile.co/f/72732734/ice-age-scrat-tales-s01e02-zonafilm-in-mp4
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

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // see if if one of the request.user.type[] is in the type[] array
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    if (allowedRoles.some((allowed) => request.user.type.includes(allowed))) {
      return true;
    } else {
      throw new ForbiddenException(
        "You don't have the required permissions to access this route",
      );
    }
  }
}
