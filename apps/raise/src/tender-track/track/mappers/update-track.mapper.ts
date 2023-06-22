import { Prisma, track } from '@prisma/client';
import { UpdateTrackDto } from '../dto/requests';

export const UpdateTrackMapper = (existing: track, request: UpdateTrackDto) => {
  const updatePayload: Prisma.trackUpdateInput = {};

  if (request.name && request.name !== existing.name) {
    updatePayload.name = request.name;
  }

  updatePayload.with_consultation = request.with_consultation;
  return updatePayload;
};
