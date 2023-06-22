import { AppointmentEntity } from '../../tender-appointment/entity/appointment.entity';
import { ProposalLogEntity } from '../../tender-proposal/tender-proposal-log/entities/proposal-log.entity';
import { ProposalEntity } from '../../tender-proposal/tender-proposal/entities/proposal.entity';

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
  read_status?: boolean = false;
  subject: string;
  shown: boolean = true;
  specific_type?: string | null;
  proposal_log_id?: string | null;
  appointment?: AppointmentEntity;
  proposal?: ProposalEntity;
  proposal_log?: ProposalLogEntity;
}
