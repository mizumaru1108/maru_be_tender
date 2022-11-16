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

    const type = this.reflector.get<string[]>('type', context.getHandler());
    if (!type) {
      return true;
    }
    if (type.findIndex((value) => value == request.user.type) > -1) {
      return true;
    } else {
      throw new ForbiddenException(
        "You don't have the required permissions to access this route",
      );
    }
  }
}
