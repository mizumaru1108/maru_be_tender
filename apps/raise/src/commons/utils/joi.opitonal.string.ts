import * as Joi from 'joi';

export const baseJoiOptionalString = (fieldName: string) => {
  return Joi.string()
    .optional()
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
