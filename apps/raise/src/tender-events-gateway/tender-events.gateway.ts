import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { BaseFilterRequest } from '../commons/dtos/base-filter-request.dto';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../libs/root-logger';
import { PrismaService } from '../prisma/prisma.service';
import { TenderFusionAuthRoles } from '../tender-commons/types';
import { CreateMessageDto } from '../tender-messaging/tender-message/dtos/requests/create-message.dto';
import { SearchMessageFilterRequest } from '../tender-messaging/tender-message/dtos/requests/search-message-filter-request.dto';
import { ToogleReadMessageDto } from '../tender-messaging/tender-message/dtos/requests/toogle-read-message.dto';
import { TenderMessagesService } from '../tender-messaging/tender-message/services/tender-messages.service';
import { TenderRoomChatService } from '../tender-messaging/tender-room-chat/services/tender-room-chat.service';
import { WsExceptionFilter } from './exceptions/ws-exception-filter';
import { AuthSocket } from './interfaces/auth-socket.interface';
import { SocketAuthMiddleware } from './middleware/socket-auth-middleware';

/**
 * @author RDanang (Iyoy!)
 *
 * Danang's note:
 * 1. Why not using the @UseGuards decorator?
 * after reseach, turns out @UseGuards cannot be used on websocket gateway so i make
 * a workaround using custom middleware (see on afterInit)
 * ref:
 * - https://github.com/nestjs/nest/issues/9231
 * - https://github.com/nestjs/nest/issues/882
 * - https://github.com/nestjs/nest/issues/1254
 *
 *
 * 2. Why we re-declare the @UsePipes and @UseFilters decorator?
 * turns out, the @UsePipes and @UseFilters that declared globaly cannot be used on websocket gateway,
 * and we have to re-declare it on the gateway itself
 *
 * 3. We have to parse the http exception thrown by the @UsePipes decorator to websocket exception.
 *
 * 4. @SubscribeMessage will only listen to the event that emitted by the client! (not the server).
 */
@UsePipes(new ValidationPipe())
@UseFilters(new WsExceptionFilter()) // custom exception filter that i have made
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000', // dev purposes
      'http://localhost:3002', // dev purposes
      'http://localhost:3004', // dev purposes
      'http://localhost:4040', // dev purposes
      /* http */
      'http://app-dev.tmra.io',
      'http://app-staging.tmra.io',
      'http://gaith.hcharity.org',
      /* https */
      'https://app-dev.tmra.io',
      'https://app-staging.tmra.io',
      'https://gaith.hcharity.org',
    ],
    methods: ['GET', 'POST'],
    credentials: false, // true if you want to send cookies (in this case we attach token on query params)
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
    private readonly tenderMessagesService: TenderMessagesService,
    private readonly tenderRoomChatService: TenderRoomChatService,
  ) {}

  @WebSocketServer()
  server: Socket;

  @SubscribeMessage('send_message') // when client emit this event, this func will be called
  async sendMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() messagebody: CreateMessageDto,
  ) {
    const userSelectedRole =
      messagebody.current_user_selected_role as TenderFusionAuthRoles;

    const response = await this.tenderMessagesService.send(
      client.user.id,
      userSelectedRole,
      messagebody,
    );

    // send to all client in the room that there is a new message
    this.server.to(response.roomChatId).emit('incoming_message', response);
  }

  @SubscribeMessage('fetch_last_messages') // when client emit this event, this func will be called
  async fetchLastMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() { limit, page }: BaseFilterRequest,
  ) {
    const response = await this.tenderRoomChatService.fetchMyLastChat(
      client.user.id,
      limit,
      page,
    );

    client.emit('last_messages_updated', response);
  }

  @SubscribeMessage('read_by_room_id')
  async readByRoomId(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() request: ToogleReadMessageDto,
  ) {
    await this.tenderMessagesService.readAllMessageByRoomId(request.roomId);
    this.server
      .to(request.roomId)
      .emit(
        'message_readed_by_room_id',
        `All message on ${request.roomId} room has been read`,
      );
  }

  @SubscribeMessage('find_message')
  async emitToggleReadStatus(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() request: SearchMessageFilterRequest,
  ) {
    const response = await this.tenderMessagesService.findMessages(
      client.user.id,
      request,
    );
    client.emit('search_message_result', response);
  }

  /* default func from nestjs for handle on connnect (OnGatewayConnection) */
  async handleConnection(@ConnectedSocket() client: AuthSocket) {
    // join to all rooms that the user is a participant in it, (as a participant1 or participant2)
    client.user.room_chat_as_participant1.forEach((room) => {
      client.join(room.id);
    });

    client.user.room_chat_as_participant2.forEach((room) => {
      client.join(room.id);
    });

    // get all last messages for updating user room chat list
    await this.fetchLastMessage(client, {});

    this.logger.log(
      'info',
      `User ${client.user.employee_name} has been connected to app!`,
    );
  }

  /* default func from nestjs for handle on disconnnect (OnGatewayDisconnect) */
  async handleDisconnect(@ConnectedSocket() client: AuthSocket) {
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

    // leave all rooms that the user is a participant in it, (as a participant1 or participant2)
    client.user.room_chat_as_participant1.forEach((room) => {
      client.leave(room.id);
    });

    client.user.room_chat_as_participant2.forEach((room) => {
      client.leave(room.id);
    });

    client.disconnect(true);

    this.logger.log(
      'info',
      `User ${client.user.employee_name} has been disconnected from the app!`,
    );
  }

  /* default func when the socket is init from NestJs (OnGatewayInit) */
  afterInit(server: Server) {
    const middleware = SocketAuthMiddleware(
      this.fusionAuthService,
      this.prismaService,
    );
    server.use(middleware);
  }
}
