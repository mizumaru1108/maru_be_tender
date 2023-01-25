import { Prisma } from '@prisma/client';

export interface UpdateUserPayload extends Prisma.userUpdateInput {
  password?: string;
}
