import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export function CreateEditRequestLogMapper(
  userId: string,
): Prisma.edit_requestsUncheckedCreateInput {
  const editRequestLog: Prisma.edit_requestsUncheckedCreateInput = {
    id: uuidv4(),
    status_id: 'PENDING',
    user_id: userId,
  };

  return editRequestLog;
}
