import { user } from '@prisma/client';
import { Socket } from 'socket.io';

export interface ConnectedSocket extends Socket {
  user: user;
}
