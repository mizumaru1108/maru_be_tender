import { Prisma } from '@prisma/client';

export interface UpdateUserPayload extends Prisma.userUpdateInput {
  password?: string;
  current_password?: string;
}
