import * as Joi from 'joi';

export const baseJoiRequiredString = (fieldName: string) => {
  return Joi.string()
    .required()
    .error((errors: any) => {
      errors.forEach((err: any) => {
        switch (err.code) {
          case 'any.required':
            err.message = `${fieldName} is required`;
            break;
          default:
            break;
        }
      });
      return errors;
    });
};
