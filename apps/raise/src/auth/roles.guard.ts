import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard
 * Used to check if the user has the required roles to access a route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * RolesGuard constructor.
   * @param reflector The reflector service.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Set the roles for the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = this.reflector.get<string[]>('type', context.getHandler());
    if (!type) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return type.findIndex((value) => value == user.type) > -1;
  }
}
