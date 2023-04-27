import { Prisma } from '@prisma/client';
import { UpdateTrackDto } from '../dto/requests';

export const UpdateTrackMapper = (request: UpdateTrackDto) => {
  const updatePayload: Prisma.trackUpdateInput = {
    name: request.name,
    with_consultation: request.with_consultation,
  };
  return updatePayload;
};
