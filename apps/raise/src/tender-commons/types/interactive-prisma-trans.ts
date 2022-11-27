import { PrismaClient } from '@prisma/client';

export type TransactionalPrismaClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
> & { readonly $transactional: true };
