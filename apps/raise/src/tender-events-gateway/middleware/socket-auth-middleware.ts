import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import { WsException } from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import {
  WsUnauthorizedException,
  WsUnknownException,
} from '../exceptions/ws-exception';
import { AuthSocket } from '../interfaces/auth-socket.interface';
import { SocketMiddleware } from '../types/socket-middleware.type';

const logger = ROOT_LOGGER.child({
  'log.logger': `Socket Auth Middleware`,
});

export const SocketAuthMiddleware = (
  fusionAuthService: FusionAuthService,
  prismaService: PrismaService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    if (!socket.handshake.query.accessToken) {
      next(new WsUnauthorizedException('Access token is required!'));
    }

    const jwtToken = socket.handshake.query.accessToken as string;

    try {
      const validToken = await fusionAuthService.fusionAuthValidateToken(
        jwtToken,
      );

      if (
        !validToken ||
        !validToken.response.jwt ||
        !validToken.response.jwt.sub
      ) {
        next(new WsUnauthorizedException('Invalid token!'));
      }

      const user = await prismaService.user.findFirst({
        where: {
          id: validToken.response.jwt!.sub!,
        },
        include: {
          room_chat_as_participant1: {
            select: {
              id: true,
            },
          },
          room_chat_as_participant2: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        next(new WsUnauthorizedException('User is not found on this app!'));
      }

      const userUpdatePayload: Prisma.userUpdateInput = {
        is_online: true,
      };

      const logginedUser = await prismaService.user.update({
        where: {
          id: user!.id!,
        },
        data: userUpdatePayload,
        include: {
          room_chat_as_participant1: {
            select: {
              id: true,
            },
          },
          room_chat_as_participant2: {
            select: {
              id: true,
            },
          },
        },
      });

      socket.user = logginedUser;
      next();
    } catch (error) {
      // if block for handle websocket / fusion auth / prisma / unknown error
      if (
        error instanceof ClientResponse &&
        error.wasSuccessful().valueOf() === false
      ) {
        if (error.statusCode === 401) {
          next(new WsUnauthorizedException('Invalid token!')); // parse to ws exception
        } else {
          logger.error('(Source fusion auth), Error: ', error);
        }
      } else if (error instanceof WsException) {
        next(error);
      } else if (
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.NotFoundError
      ) {
        let instance = '';
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          instance = 'PrismaClientKnownRequestError';
        }
        if (error instanceof Prisma.PrismaClientRustPanicError) {
          instance = 'PrismaClientRustPanicError';
        }
        if (error instanceof Prisma.PrismaClientInitializationError) {
          instance = 'PrismaClientInitializationError';
        }
        if (error instanceof Prisma.PrismaClientUnknownRequestError) {
          instance = 'PrismaClientUnknownRequestError';
        }
        if (error instanceof Prisma.NotFoundError) {
          instance = 'NotFoundError';
        }
        logger.error(`(Source: Prisma[${instance}]), Error:`, error);
        next(
          new WsUnknownException(
            'Something went wrong when reading user data!',
          ),
        );
      } else {
        logger.error('(Source: Unknown), Error:', error);
        next(new WsUnknownException('Something went wrong!'));
      }
    }
  };
};
