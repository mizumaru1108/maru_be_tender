import { Prisma } from '@prisma/client';
import { CreateTrackDto } from '../dto/requests';
import { v4 as uuidv4 } from 'uuid';

export const CreateTrackMapper = (
  request: CreateTrackDto,
): Prisma.trackUncheckedCreateInput => {
  const payload: Prisma.trackUncheckedCreateInput = {
    id: uuidv4(),
    name: request.name,
    with_consultation: request.with_consultation,
  };

  return payload;
};
