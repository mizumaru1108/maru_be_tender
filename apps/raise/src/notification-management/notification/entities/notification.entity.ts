import { ProposalLogEntity } from '../../../proposal-management/proposal-log/entities/proposal-log.entity';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { AppointmentEntity } from '../../../tender-appointment/entity/appointment.entity';

export class NotificationEntity {
  id: string;
  content: string;
  proposal_id?: string | null;
  message_id?: string | null;
  appointment_id?: string | null;
  user_id: string;
  type: string;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  read_status?: boolean | null = false;
  subject: string;
  shown: boolean = true;
  specific_type?: string | null;
  proposal_log_id?: string | null;
  appointment?: AppointmentEntity;
  proposal?: ProposalEntity;
  proposal_log?: ProposalLogEntity;
}
