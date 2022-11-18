import { SetMetadata } from '@nestjs/common';
import { TenderFusionAuthRoles } from '../../tender-commons/types';

export const TenderRoles = (...roles: TenderFusionAuthRoles[]) =>
  SetMetadata('roles', roles);
