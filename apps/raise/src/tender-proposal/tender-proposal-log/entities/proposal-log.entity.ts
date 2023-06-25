import { UserTypeEntity } from '../../../tender-auth/entity/user-type.entity';
import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { NotificationEntity } from '../../../tender-notification/entities/notification.entity';
import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProposalLogEntity {
  id: string;
  proposal_id: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  reviewer_id?: string | null;
  state: string;
  notes?: string | null;
  action?: string | null;
  message?: string | null;
  user_role?: string | null;
  response_time?: number | null;
  reject_reason?: string | null;
  reviewer?: UserEntity;
  proposal: ProposalEntity;
  notification?: NotificationEntity[];
  user_type?: UserTypeEntity;
}
