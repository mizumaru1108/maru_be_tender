import { Prisma } from '@prisma/client';
import { CreateProjectBudgetDto } from '../dtos/requests/create-proposal-item-budget.dto';
import { v4 as uuidv4 } from 'uuid';

export const SupervisorAccCreatedRecommendedSupportMapper = (
  proposal_id: string,
  created_recommended_support: CreateProjectBudgetDto[] | undefined,
  createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
): Prisma.recommended_support_consultantCreateManyInput[] => {
  if (created_recommended_support && created_recommended_support.length > 0) {
    for (const recommendSupport of created_recommended_support) {
      createdRecommendedSupportPayload.push({
        id: uuidv4(),
        amount: recommendSupport.amount,
        clause: recommendSupport.clause,
        explanation: recommendSupport.explanation,
        proposal_id,
      });
    }
  }
  return createdRecommendedSupportPayload;
};
