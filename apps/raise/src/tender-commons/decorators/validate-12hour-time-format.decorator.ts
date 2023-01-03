import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Validate12HourTimeFormat(
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Validate12HourTimeFormat',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // options each is true so we can use it with {each: true}
          // if the value is [] then it will be splitted
          if (validationOptions && validationOptions.each) {
            if (typeof value !== 'string') {
              throw new BadRequestException(
                `${propertyName} must be a string!`,
              );
            }
            // validate that the time is in 12 hour format
            if (!value.match(/^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)) {
              throw new BadRequestException(
                `${args.property} (${value}) is an invalid 12 hour time format!, it must be in the format of hh:mm AM/PM (ex: 12:00 AM)`,
              );
            }
          } else {
            // if the value is [] than it will readed as array because it's the validationOption.each is false
            if (typeof value !== 'string') {
              throw new BadRequestException(
                `${propertyName} must be a string!`,
              );
            }
            if (!value.match(/^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)) {
              throw new BadRequestException(
                `${args.property} (${value}) is an invalid 12 hour time format!, it must be in the format of hh:mm AM/PM (ex: 12:00 AM)`,
              );
            }
          }
          return true;
        },
      },
    });
  };
}
