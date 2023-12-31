import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateProjectBudgetDto } from '../dtos/requests/create-proposal-item-budget.dto';

export const CreateItemBudgetsMapper = (
  proposal_id: string,
  request: CreateProjectBudgetDto[],
): Prisma.proposal_item_budgetCreateManyInput[] => {
  return request.map((payload: CreateProjectBudgetDto) => {
    const notification: Prisma.proposal_item_budgetCreateManyInput = {
      id: payload.id ? payload.id : uuidv4(),
      amount: payload.amount,
      clause: payload.clause,
      explanation: payload.explanation,
      proposal_id: proposal_id,
    };
    return notification;
  });
};
