import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export const validateObjectId = (id: string) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid Object ID');
  }
};
