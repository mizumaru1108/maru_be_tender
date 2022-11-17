import { SetMetadata } from '@nestjs/common';

export const TenderRoles = (...roles: string[]) => SetMetadata('roles', roles);
