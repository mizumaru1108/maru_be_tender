import { UserEntity } from '../../user/entities/user.entity';

export class EditRequestEntity {
  id: string;
  user_id: string;
  reviewer_id?: string | null;
  status_id: string;
  reject_reason?: string | null;
  rejected_at?: Date | null;
  accepted_at?: Date | null;
  created_at: Date;
  new_value: string;
  old_value: string;
  user: UserEntity;
  reviewer?: UserEntity;
  edit_request_status?: any;
}
