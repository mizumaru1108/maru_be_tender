import { UserEntity } from '../../tender-auth/entity/user.entity';

export class AppointmentEntity {
  id: string;
  empolyee_id: string;
  user_id: string;
  meeting_url: string;
  calendar_url: string;
  date: Date;
  start_time: string;
  end_time: string;
  reject_reason?: string;
  status: string;
  day: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  calendar_event_id: string;
  employee: UserEntity;
  client: UserEntity;
  // notification?: NotificationEntity[];
}
