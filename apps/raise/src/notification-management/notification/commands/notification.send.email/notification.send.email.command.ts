import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/libs/email/email.service';
export class NotificationSendEmailCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email?: string;
  phone_number?: string;
  content: string;
  subject: string;
}

@CommandHandler(NotificationSendEmailCommand)
export class NotificationSendEmailCommandHandler
  implements ICommandHandler<NotificationSendEmailCommand>
{
  constructor(private readonly emailService: EmailService) {}
  async execute(command: NotificationSendEmailCommand): Promise<any> {}
}
