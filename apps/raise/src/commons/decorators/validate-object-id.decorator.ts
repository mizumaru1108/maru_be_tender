import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';

export const ValidateObjectId = () =>
  Transform(({ value }) => {
    if (!value) {
      throw new BadRequestException('Invalid id');
    }
    const isValid = isValidObjectId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  });
