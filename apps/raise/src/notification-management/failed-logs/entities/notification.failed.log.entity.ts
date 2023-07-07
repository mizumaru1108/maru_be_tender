// model NotificationFailedLogs {
//   id String @id
//   error_log String
//   content String
//   subject String
//   user_id String?
//   email String?
//   phone String?

//   @@map("notification_failed_logs")
// }

export class NotificationFailedLogs {
  id: string;
  error_log: string;
  content: string;
  subject: string;
  type: string;
  email?: string;
  phone?: string;
  user_id?: string;
}
