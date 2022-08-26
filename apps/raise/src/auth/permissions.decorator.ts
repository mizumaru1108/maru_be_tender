import { SetMetadata } from '@nestjs/common';

/**
 * Cluster-level (FusionAuth) Roles Decorator.
 * Used to set cluster roles for a route.
 */
export const Permissions = (...type: string[]) => SetMetadata('type', type);