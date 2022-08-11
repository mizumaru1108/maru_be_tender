import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { UserService } from '../user/user.service';

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
  constructor(private reflector: Reflector, private userService: UserService) {}

  /**
   * Set the roles for the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let currentUser: ICurrentUser = request.user;
    const tmpUser = await this.userService.getOneUser({
      _id: currentUser.id,
      email: currentUser.email,
    });
    if (!tmpUser) throw new Error('Error fetching roles');
    currentUser.type = tmpUser.type!;
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
