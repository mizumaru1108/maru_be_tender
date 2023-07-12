export class NotificationFailedLogEntity {
  id: string;
  error_log: string;
  content: string;
  subject: string;
  type: string;
  user_id: string;
  email?: string | null;
  phone?: string | null;
}
