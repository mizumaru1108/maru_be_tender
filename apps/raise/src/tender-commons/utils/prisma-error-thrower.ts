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
 * for handling nest error exception and prisma error included with winston logger.
 * @param error - the error from prisma / nest catched by try catch
 * @param serviceName - the name of the service that throw the error (for winston logger)
 * @param loggerMessage - the message that will be logged by winston logger
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
      instance = 'PrismaClientKnownRequestError';
    }
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      instance = 'PrismaClientRustPanicError';
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      instance = 'PrismaClientInitializationError';
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      instance = 'PrismaClientUnknownRequestError';
    }
    if (error instanceof Prisma.NotFoundError) {
      instance = 'NotFoundError';
    }
    logger.error(`( Source: Prisma ${instance}), Error:`, error);
    return new InternalServerErrorException(
      `Something went wrong at '${errorThrowMessage}'`,
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
