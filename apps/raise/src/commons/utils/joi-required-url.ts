import * as Joi from 'joi';

export const baseJoiRequiredUrl = (fieldName: string) => {
  return Joi.string()
    .uri()
    .required()
    .error((errors: any) => {
      errors.forEach((err: any) => {
        switch (err.code) {
          case 'any.required':
            err.message = `${fieldName} is required`;
            break;
          case 'string.uri':
            err.message = `${fieldName} must be a valid URL`;
            break;
          default:
            break;
        }
      });
      return errors;
    });
};
