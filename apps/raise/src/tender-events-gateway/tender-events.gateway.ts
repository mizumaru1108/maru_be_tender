import { Body } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { user } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketAuthMiddleware } from '../tender-auth/guards/socket-auth-middleware';
// import { SocketAuthMiddleware } from '../tender-auth/guards/socket-auth-middleware';
// import { SocketAuthGuard } from '../tender-auth/guards/socket-auth.guard';
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
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Socket;

  @SubscribeMessage('incoming_message')
  async emitIncomingMessage(
    @ConnectedSocket() client: AuthSocket,
    @Body() summary: IIncomingMessageSummary,
  ) {
    client.send('test', summary);
  }

  handleConnection(client: AuthSocket) {
    console.log('client connect', client.id, client.user);
  }

  async handleDisconnect(client: AuthSocket) {
    console.log('client disconnect', client.id, client.user);
  }

  afterInit(server: Server) {
    const middleware = SocketAuthMiddleware(
      this.fusionAuthService,
      this.prismaService,
    );
    server.use(middleware);
  }
}
