import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('SocketSession activated');
    const client = context?.switchToWs().getData();
    const client2 = context?.switchToWs().getClient();
    console.log(client);
    console.log(client2);
    // return SocketAuthGuard.verifyToken(
    //   this.jwtService,
    //   client,
    //   client.request['token'],
    // );

    return true;
  }

  // static async verifyToken(
  //   jwtService: JwtService,
  //   socket: ConnectedSocket,
  //   token?: string,
  // ) {
  //   if (
  //     socket.conn.userId &&
  //     (await jwtService.verifyAsync(socket.conn.token))
  //   ) {
  //     return true;
  //   }

  //   if (!token) return false;

  //   socket.conn.token = token;
  //   const { sub } = await jwtService.decode(token);
  //   socket.conn.userId = sub;
  //   console.log(`Setting connection userId to "${sub}"`);
  //   return true;
  // }
}
