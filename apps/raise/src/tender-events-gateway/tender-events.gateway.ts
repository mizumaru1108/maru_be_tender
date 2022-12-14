import { Body, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Prisma, user } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../libs/root-logger';
import { PrismaService } from '../prisma/prisma.service';
import { SocketAuthMiddleware } from '../tender-auth/guards/socket-auth-middleware';
import { IIncomingMessageSummary } from '../tender-messages/interfaces/incomming-message';

export interface AuthSocket extends Socket {
  user: user;
}
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000', // dev purposes
      /* http */
      'http://app-dev.tmra.io',
      'http://app-staging.tmra.io',
      'http://gaith.hcharity.org',
      /* https */
      'https://app-dev.tmra.io',
      'https://app-staging.tmra.io',
      'https://gaith.hcharity.org',
    ],
    credentials: true,
  },
})
export class TenderEventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderEventsGateway.name,
  });

  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Socket;

  @SubscribeMessage('incoming_message')
  async emitIncomingMessage(@Body() summary: IIncomingMessageSummary) {
    this.logger.log(
      'info',
      `Emitting incoming message to ${summary.receiverEmployeeName}`,
    );
    this.server.to(summary.receiverId).emit('incoming_message', summary);
  }

  handleConnection(client: AuthSocket) {
    client.join(client.user.id);
    this.logger.log(
      'info',
      `User ${client.user.employee_name} has been connected to app!`,
    );
  }

  async handleDisconnect(client: AuthSocket) {
    const userUpdatePayload: Prisma.userUpdateInput = {
      is_online: false,
      last_login: new Date().toISOString(),
    };

    await this.prismaService.user.update({
      where: {
        id: client.user.id,
      },
      data: userUpdatePayload,
    });

    client.leave(client.user.id);
    client.disconnect(true);
    this.logger.log(
      'info',
      `User ${client.user.employee_name} has been disconnected from the app!`,
    );
  }

  afterInit(server: Server) {
    const middleware = SocketAuthMiddleware(
      this.fusionAuthService,
      this.prismaService,
    );
    server.use(middleware);
  }
}
