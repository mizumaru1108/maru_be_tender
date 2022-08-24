import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isValidObjectId } from 'mongoose';

export const ValidateObjectId = () =>
  Transform(({ key, value }) => {
    if (!value) {
      throw new BadRequestException(`${key} cant be empty!`);
    }
    const isValid = isValidObjectId(value);
    if (!isValid) {
      throw new BadRequestException(`${key} is an invalid ObjectId!`);
    }
    return value;
  });
