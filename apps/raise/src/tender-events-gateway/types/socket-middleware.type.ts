import { Socket } from 'socket.io';

/**
 * @author RDanang (Iyoy!)
 * used for custom middleware
 */
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
