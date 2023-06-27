import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProposalFollowUpEntity {
  id: string;
  proposal_id: string;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  attachments?: any; // json
  content?: string | null;
  user_id: string;
  submitter_role: string;
  employee_only: boolean;
  user?: UserEntity;
  proposal?: ProposalEntity;
}
