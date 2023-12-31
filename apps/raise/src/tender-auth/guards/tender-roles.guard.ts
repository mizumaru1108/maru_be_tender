import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * @author RDananag (iyoy)
 * RolesGuard Decorator
 * Used to check if the user has the required FusionAuth roles to access a route.
 */
@Injectable()
export class TenderRolesGuard implements CanActivate {
  /**
   * RolesGuard constructor.
   * @param reflector The reflector service.
   */
  constructor(
    private reflector: Reflector,
    @InjectPinoLogger(TenderRolesGuard.name) private logger: PinoLogger,
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

    // console.log({ allowedRoles });
    // console.log(request.user.choosenRole);

    // act as multiple roles
    // see if if one of the request.user.type[] is in the type[] array
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    // if (allowedRoles.some((allowed) => request.user.choosenRole.includes(allowed))) {
    //   return true;
    // } else {
    //   throw new ForbiddenException(
    //     "You don't have the required permissions to access this route",
    //   );
    // }

    // indexOf vs findIndex performance
    // act as single role
    // https://stackoverflow.com/questions/41443029/difference-between-indexof-and-findindex-function-of-array

    // indexof vs includes performance
    // https://stackoverflow.com/questions/47659972/array-indexof-vs-includes-perfomance-depending-on-browser-and-needle-positio
    if (allowedRoles.indexOf(request.user.choosenRole) > -1) {
      return true;
    } else {
      this.logger.info(
        "You don't have the required permissions to access this route. allowedRoles=%j but chosen role=%j",
        allowedRoles,
        request.user.choosenRole,
      );
      throw new ForbiddenException(
        "You don't have the required permissions to access this route",
      );
    }
  }
}
