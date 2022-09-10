import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function ValidateObjectIdDecorator(
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'ValidateObjectId',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // options each is true so we can use it with {each: true}
          // if the value is [] then it will be splitted
          if (validationOptions && validationOptions.each) {
            if (!isValidObjectId(value)) {
              throw new BadRequestException(`${value} is an invalid ObjectId!`);
            }
          } else {
            // if the value is [] than it will readed as array because it's the validationOption.each is false
            if (typeof value !== 'string') {
              throw new BadRequestException(
                `${propertyName} must be a string!`,
              );
            }
            if (!isValidObjectId(value)) {
              throw new BadRequestException(
                `${propertyName} is an invalid ObjectId!`,
              );
            }
          }
          return true;
        },
      },
    });
  };
}
