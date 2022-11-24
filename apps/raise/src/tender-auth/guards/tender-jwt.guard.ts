import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';

@Injectable()
export class TenderJwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private fusionAuthService: FusionAuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let jwtToken: string;

    if (request.headers.authorization) {
      const [type, token] = request.headers.authorization.split(' ');
      if (type !== 'Bearer') {
        throw new UnauthorizedException(
          "Authentication type 'Bearer' is required!",
        );
      }
      jwtToken = token;
    } else {
      throw new BadRequestException('Authorization header is required!');
    }

    // check if headers has "x-hasura-role"
    if (!request.headers['x-hasura-role']) {
      throw new BadRequestException('x-hasura-role header is required!');
    }

    try {
      const validToken = await this.fusionAuthService.fusionAuthValidateToken(
        jwtToken,
      );

      if (
        !validToken ||
        !validToken.response.jwt ||
        !validToken.response.jwt.sub
      ) {
        throw new UnauthorizedException('Invalid token!');
      }

      if (
        validToken.response.jwt.role.indexOf(
          request.headers['x-hasura-role'],
        ) === -1
      ) {
        throw new UnauthorizedException(
          "Current user doesn't have the required role to access this resource!",
        );
      }

      const user: TenderCurrentUser = {
        id: validToken.response.jwt.sub,
        email: validToken.response.jwt.email,
        type: validToken.response.jwt.role,
        choosenRole: request.headers['x-hasura-role'],
      };

      request.user = user;
    } catch (e) {
      console.log(e);
      if (
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      throw new UnauthorizedException('Invalid token!');
    }
    return true;
  }
}
