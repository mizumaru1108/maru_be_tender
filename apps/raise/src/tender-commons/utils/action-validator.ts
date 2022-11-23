import { BadRequestException } from '@nestjs/common';

export const actionValidator = (
  allowedAction: string[],
  currentAction: string,
) => {
  if (allowedAction.indexOf(currentAction) === -1) {
    throw new BadRequestException(
      `You are not allowed to perform ${currentAction} `,
    );
  }
};
