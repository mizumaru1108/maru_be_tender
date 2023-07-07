import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';

export class ProposalEditRequestEntity {
  id: string;
  detail: string;
  user_id: string;
  reviewer_id: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  proposal_id: string;
  proposal: ProposalEntity;
  reviewer: UserEntity;
  user: UserEntity;
}
