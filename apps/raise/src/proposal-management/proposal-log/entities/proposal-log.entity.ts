import { NotificationEntity } from '../../../notification-management/notification/entities/notification.entity';
import { UserTypeEntity } from '../../../tender-user/user/entities/user-type.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';

export class ProposalLogEntity {
  id: string;
  proposal_id: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  reviewer_id?: string | null;
  state: string;
  new_values?: any; // jsonb
  old_values?: any; // jsonb
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
