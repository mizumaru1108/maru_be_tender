import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthSocket } from '../interfaces/auth-socket.interface';

import { WsBadRequestException } from './ws-exception';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const socket: AuthSocket = host.switchToWs().getClient();

    // console.log('exception type:', typeof exception);

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      console.log('exceptionData', exceptionData);

      // type of exceptionData is object | string.
      const errorMessage =
        typeof exceptionData === 'object' // if exception is an object then get exceptionData['message']
          ? (exceptionData as { message: string | string[] }).message // it will be string or string[]
          : typeof exceptionData === 'string' // if exception is a string
          ? exceptionData // then return the string as value of errorMessage
          : Array.isArray(exceptionData) // if exception is an array
          ? exceptionData[0] // then return the first element of the array as value of errorMessage
          : exceptionData; // otherwise return the exceptionData (string) as value of errorMessage

      const wsException = new WsBadRequestException(
        errorMessage || 'Payload validation failed!',
      );

      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof WsException) {
      const wsException = new WsException(exception.message);

      socket.emit('exception', wsException.getError());
    }
  }
}
