import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const BaseErrorThrower = (error: any, customMessage?: string) => {
  if (
    error instanceof BadRequestException ||
    error instanceof ForbiddenException ||
    error instanceof NotFoundException
  ) {
  } else {
    throw new InternalServerErrorException(
      customMessage
        ? `Something went wrong when ${customMessage}`
        : 'Something went wrong!',
    );
  }
};
