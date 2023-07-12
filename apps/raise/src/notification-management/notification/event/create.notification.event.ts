export class CreateNotificationEvent {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  content: string;
  subject: string;
  email?: string;
  email_sender?: string;
  phone_number?: string;
  email_type?: 'template' | 'plain';
  emailTemplateContext?: Record<string, any>;
  emailTemplatePath?: string;
}
