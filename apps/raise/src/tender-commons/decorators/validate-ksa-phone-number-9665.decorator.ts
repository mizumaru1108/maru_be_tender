import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateKsaPhoneNumber9665(
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'ValidateKsaPhoneNumber',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // options each is true so we can use it with {each: true}
          // if the value is [] then it will be splitted
          if (validationOptions && validationOptions.each) {
            if (!value.match(/^\+9665[0-9]{8}$/)) {
              throw new BadRequestException(
                `${args.property} (${value}) is an invalid (+9665) KSA phone number!`,
              );
            }
          } else {
            // if the value is [] than it will readed as array because it's the validationOption.each is false
            if (typeof value !== 'string') {
              throw new BadRequestException(
                `${propertyName} must be a string!`,
              );
            }
            if (!value.match(/^\+9665[0-9]{8}$/)) {
              throw new BadRequestException(
                `${args.property} (${value}) is an invalid (+9665) KSA phone number!`,
              );
            }
          }
          return true;
        },
      },
    });
  };
}
