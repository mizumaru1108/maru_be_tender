import { ForbiddenException } from '@nestjs/common';

export const ownershipErrorThrow = () => {
  throw new ForbiddenException(
    'You are not the person in charge for this proposal!',
  );
};
