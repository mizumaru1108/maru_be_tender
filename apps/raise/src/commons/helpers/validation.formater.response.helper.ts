import { ValidationError } from '@nestjs/common';

export function validationFormaterResponse(
  errors: ValidationError[],
  parent_field?: string,
): Record<string, string[]> {
  let validation_errors: Record<string, string[]> = {};
  errors.forEach((err: ValidationError) => {
    if (err.children && err.children.length > 0) {
      const error_children: Record<string, string[]> =
        validationFormaterResponse(err.children, err.property);
      validation_errors = { ...validation_errors, ...error_children };
    } else {
      validation_errors[
        parent_field && parent_field !== ''
          ? `${parent_field}.${err.property}`
          : `${err.property}`
      ] = Object.values(err?.constraints || '');
    }
  });

  return validation_errors;
}
