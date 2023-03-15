import { Prisma } from '@prisma/client';

export interface UpdateUserPayload extends Prisma.userUncheckedUpdateInput {
  password?: string;
}
