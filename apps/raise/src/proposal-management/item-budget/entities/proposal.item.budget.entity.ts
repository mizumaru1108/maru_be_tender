import { ProposalEntity } from '../../proposal/entities/proposal.entity';

export class ProposalItemBudgetEntity {
  id: string;
  amount: number;
  explanation: string;
  clause: string;
  proposal_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  proposal: ProposalEntity;
}
