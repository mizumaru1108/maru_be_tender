import { Prisma } from '@prisma/client';

export type ProposalItemBudget = {
  id: string;
  proposal_id: string;
  amount: Prisma.Decimal;
  clause: string;
  explanation: string;
};
