import { Prisma } from '@prisma/client';
import { CreateTrackBudgetDto } from '../dtos/requests';
import { v4 as uuidv4 } from 'uuid';

export const CreateTrackBudgetMapper = (
  request: CreateTrackBudgetDto,
): Prisma.track_sectionCreateManyInput[] => {
  const trackSectionBudgets: Prisma.track_sectionCreateManyInput[] =
    request.track_ids.map((trackId) => {
      return {
        id: uuidv4(),
        name: request.name,
        budget: request.budget,
        track_id: trackId,
      };
    });

  return trackSectionBudgets;
};
