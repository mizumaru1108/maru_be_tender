import { user } from '@prisma/client';
import { Socket } from 'socket.io';

/**
 * @author RDanang (Iyoy!)
 * basicly used toappend user to socket object
 */
export interface AuthSocket extends Socket {
  user: user & {
    room_chat_as_participant1: {
      id: string;
    }[];
    room_chat_as_participant2: {
      id: string;
    }[];
  };
}
