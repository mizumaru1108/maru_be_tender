export class CreateNotificationEvent {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email?: string;

  content: string;
  subject: string;
}
