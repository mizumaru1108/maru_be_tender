import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProposalItemBudgetEntity {
  id: string;
  amount: number;
  explanation: string;
  clause: string;
  proposal_id: string;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  proposal: ProposalEntity;
}
