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
  error: any,
  serviceName: string,
  loggerMessage: string,
  errorThrowMessage: string,
) {
  let logger = ROOT_LOGGER.child({
    'log.logger': serviceName,
  });
  logger.error(loggerMessage, error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new InternalServerErrorException(
      `Something went wrong at ${errorThrowMessage}, (Prisma: ${error.code})`,
    );
  } else if (
    error instanceof BadRequestException ||
    error instanceof ForbiddenException ||
    error instanceof ConflictException ||
    error instanceof NotFoundException
  ) {
    return error;
  } else {
    return new InternalServerErrorException(
      `Something went wrong at '${errorThrowMessage}'`,
    );
  }
}
