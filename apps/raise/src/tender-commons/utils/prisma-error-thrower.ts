import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';

/**
 * Prisma Error Thrower
 * for handling nest error exception and prisma error included with Pino/Winston logger.
 * @param error - the error from prisma / nest catched by try catch
 * @param serviceName - the name of the service that throw the error (for Pino/Winston logger)
 * @param loggerMessage - the message that will be logged by Pino/Winston logger
 * @param errorThrowMessage - the message that will be shown to the user (throwed by nest)
 * @returns the error that will be throwed by nest / prisma / null
 * @author RDanang(Iyoy)
 */
export function prismaErrorThrower(
  error: Error,
  serviceName: string,
  loggerMessage: string,
  errorThrowMessage: string,
) {
  const logger = ROOT_LOGGER.child({
    'log.logger': serviceName,
  });

  // ref: https://www.prisma.io/docs/reference/api-reference/error-reference
  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.NotFoundError
  ) {
    let instance = '';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //Prisma Client throws a PrismaClientKnownRequestError exception if
      //the query engine returns a known error related to the request -
      //for example, a unique constraint violation.
      // this.logger.log('info', `prisma error code: ${error}`);
      instance = 'PrismaClientKnownRequestError';
    }
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      // Prisma Client throws a PrismaClientRustPanicError exception if
      // the underlying engine crashes and exits with a non-zero exit code.
      // In this case, Prisma Client or the whole Node process must be restarted.
      instance = 'PrismaClientRustPanicError';
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      // Prisma Client throws a PrismaClientInitializationError exception if
      // something goes wrong when the query engine is started and the connection
      // to the database is created.
      instance = 'PrismaClientInitializationError';
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      // Prisma Client throws a PrismaClientUnknownRequestError exception if
      // the query engine returns an error related to a request that does
      // not have an error code.
      instance = 'PrismaClientUnknownRequestError';
    }
    if (error instanceof Prisma.NotFoundError) {
      instance = 'NotFoundError';
    }
    logger.error(`( Source: Prisma ${instance}), Error:`, error);
    return new InternalServerErrorException(
      `Something went wrong, detail: ${
        instance ? instance : "'instance not found'"
      },name: ${
        error && error.name ? error.name : "'error name not found!'"
      }, message: ${
        error && error.message ? error.message : "'error message not found!'"
      }, stack: ${
        error && error.stack ? error.stack : "'error.stack not defined'"
      }`,
    );
  } else if (
    error instanceof BadRequestException ||
    error instanceof ForbiddenException ||
    error instanceof ConflictException ||
    error instanceof NotFoundException
  ) {
    logger.error(loggerMessage, error);
    return error;
  } else {
    logger.error(loggerMessage, error);
    return new InternalServerErrorException(
      `Something went wrong at '${errorThrowMessage}'`,
    );
  }
}
