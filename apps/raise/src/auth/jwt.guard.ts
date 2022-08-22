import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { ICurrentUser } from '../user/interfaces/current-user.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
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
    const fusionauth = await this.fusionAuthService.useFusionAuthClient();
    try {
      // const validToken = await fusionauth.retrieveUserUsingJWT(jwtToken);
      const validToken = await fusionauth.validateJWT(jwtToken);
      const user: ICurrentUser = {
        id: validToken.response.jwt!.sub!,
        email: validToken.response.jwt!.email!,
        type: validToken.response.jwt!.roles! ?? [],
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
