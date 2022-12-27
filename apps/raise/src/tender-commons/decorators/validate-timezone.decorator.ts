import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateTimeZone(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'ValidateTimeZone',
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

            if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
              throw new Error(
                'Time zones are not available in this environment',
              );
            }

            try {
              Intl.DateTimeFormat(undefined, { timeZone: `${value}` });
              return true;
            } catch (ex) {
              throw new BadRequestException(
                `${value} is an invalid time zone!`,
              );
            }
          } else {
            // if the value is [] than it will readed as array because it's the validationOption.each is false
            if (typeof value !== 'string') {
              throw new BadRequestException(
                `${propertyName} must be a string!`,
              );
            }
            // if (!isValidObjectId(value)) {
            //   throw new BadRequestException(
            //     `${propertyName} is an invalid ObjectId!`,
            //   );
            // }
            if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
              throw new Error(
                'Time zones are not available in this environment',
              );
            }

            try {
              Intl.DateTimeFormat(undefined, { timeZone: `${value}` });
              return true;
            } catch (ex) {
              throw new BadRequestException(
                `${value} is an invalid time zone!`,
              );
            }
          }
          return true;
        },
      },
    });
  };
}
