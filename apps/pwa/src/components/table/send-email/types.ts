export interface EmailSender {
  id?: string;
  employee_name?: string;
  email?: string;
}

export type EmailToClient = {
  email_record_id?: string;
  title?: string;
  content?: string;
  sender_id?: string;
  receiver_id?: null;
  attachments?: string;
  user_on_app?: boolean;
  receiver_name?: string;
  receiver_email?: string;
  created_at?: Date;
  updated_at?: Date;
  sender?: EmailSender;
  receiver?: null;
};

export interface EmailToClienRow {
  row: EmailToClient;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
