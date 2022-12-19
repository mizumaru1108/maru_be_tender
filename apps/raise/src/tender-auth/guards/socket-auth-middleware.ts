import { WsException } from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Socket } from 'socket.io';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthSocket } from '../../tender-events-gateway/tender-events.gateway';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const SocketAuthMiddleware = (
  fusionAuthService: FusionAuthService,
  prismaService: PrismaService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    console.log('starting socket auth middleware');

    if (!socket.handshake.query.accessToken) {
      // throw new WsException('Access token is required!');
      // throw new BadRequestException('Access token is required!');
      next({
        name: 'Unauthorized',
        message: 'Access token is required!',
      });
    }

    let jwtToken = socket.handshake.query.accessToken as string;

    try {
      const validToken = await fusionAuthService.fusionAuthValidateToken(
        jwtToken,
      );

      if (
        !validToken ||
        !validToken.response.jwt ||
        !validToken.response.jwt.sub
      ) {
        // throw new WsException('Invalid token!');
        // throw new UnauthorizedException('Invalid token!');
        next({
          name: 'Unauthorized',
          message: 'Invalid token!',
        });
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
        next({
          name: 'NotFound',
          message: 'User is not found on this app!',
        });
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

      // console.log('logginedUser', logginedUser);

      if (logginedUser) {
        socket.user = logginedUser;
        next();
      } else {
        // throw new WsException('Failed to update user login status!');
        next({
          name: 'Unauthorized',
          message: 'Failed to update user login status!',
        });
      }
    } catch (error) {
      console.log('error on catch', error);
      // throw new WsException(
      //   'Something went wrong when trying to listen to the sockets!',
      // );
      next({
        name: 'Unknown',
        message: 'Something went wrong when trying to listen to the sockets!',
      });
    }
  };
};
