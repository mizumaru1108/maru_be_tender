import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function prismaErrorThrower(error: any, errorMessage: string) {
  console.log(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new InternalServerErrorException(
      `Something went wrong at ${errorMessage}, (Prisma: ${error.code})`,
    );
  } else if (
    error instanceof BadRequestException ||
    error instanceof ForbiddenException
  ) {
    return error;
  } else {
    return new InternalServerErrorException(
      `Something went wrong at '${errorMessage}'`,
    );
  }
}
