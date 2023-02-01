import { Prisma } from '@prisma/client';
import { CreateProjectBudgetDto } from '../dtos/requests/create-proposal-item-budget.dto';
import { v4 as uuidv4 } from 'uuid';

export const SupervisorAccCreatedItemBudgetMapper = (
  proposal_id: string,
  created_proposal_budget: CreateProjectBudgetDto[] | undefined,
  createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
): Prisma.proposal_item_budgetCreateManyInput[] => {
  if (created_proposal_budget && created_proposal_budget.length > 0) {
    for (const itemBudget of created_proposal_budget) {
      createdItemBudgetPayload.push({
        id: uuidv4(),
        amount: itemBudget.amount,
        clause: itemBudget.clause,
        explanation: itemBudget.explanation,
        proposal_id,
      });
    }
  }
  return createdItemBudgetPayload;
};
