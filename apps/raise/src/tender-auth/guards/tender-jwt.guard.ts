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
    try {
      const validToken = await this.fusionAuthService.fusionAuthValidateToken(
        jwtToken,
      );
      if (!validToken || !validToken.response.jwt) {
        throw new UnauthorizedException('Invalid token!');
      }
      const user: TenderCurrentUser = {
        id: validToken.response.jwt.sub ?? '',
        email: validToken.response.jwt.email,
        type: validToken.response.jwt.roles ?? null,
      };
      // console.log(user);
      request.user = user;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Session Expired!');
    }
    return true;
  }
}
