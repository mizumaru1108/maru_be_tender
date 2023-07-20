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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * @author RDananag (iyoy)
 * Tender Jwt Guard, used to make sure that the user is authenticated.
 * 1. to use this guard, you have to attach Authorization header with Bearer token
 * 2. to use this guard, you have to attach x-hasura-role header with the role that you want to check
 * 3. this guard can be combined with TenderRolesGuard and TenderGoogleOAuth2Guard
 */
@Injectable()
export class TenderJwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly prismaService: PrismaService,
    @InjectPinoLogger(TenderJwtGuard.name) private logger: PinoLogger,
  ) {
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

      const xHasuraRole = request.headers['x-hasura-role'];
      if (validToken.response.jwt.roles.indexOf(xHasuraRole) === -1) {
        throw new UnauthorizedException(
          `Current user roles doesn't have the required role to access this resource!`,
        );
      }

      const user: TenderCurrentUser = {
        id: validToken.response.jwt.sub,
        email: validToken.response.jwt.email,
        type: validToken.response.jwt.role,
        choosenRole: request.headers['x-hasura-role'],
      };

      // if the user wasn't client then get the track id of that user
      if (user.choosenRole !== 'tender_client') {
        const tmpUser = await this.prismaService.user.findFirst({
          where: { id: user.id },
        });

        if (!tmpUser) {
          throw new UnauthorizedException('User not found!,Invalid token!');
        }

        if (!tmpUser.track_id) {
          throw new UnauthorizedException(
            'Cant fetch track data, Invalid token!',
          );
        }

        user.track_id = tmpUser.track_id;
      }

      request.user = user;
    } catch (e) {
      // console.log(e);
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
