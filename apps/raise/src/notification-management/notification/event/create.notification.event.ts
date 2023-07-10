export class CreateNotificationEvent {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email?: string;
  phone_number?: string;
  content: string;
  subject: string;
}
