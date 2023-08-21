import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';

export class ProposalAskedEditRequestEntity {
  id: string;
  notes: string;
  sender_id: string;
  sender_role: string;
  proposal_id: string;
  created_at?: Date = new Date();
  status: string; // PENDING / SUCCESS
  supervisor_id: string | null;
  proposal?: ProposalEntity;
  sender?: UserEntity;
  supervisor?: UserEntity;
}
