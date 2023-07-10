import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/libs/email/email.service';
export class NotificationSendEmailCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email: string;
  phone_number?: string;
  email_type?: 'template' | 'plain';
  emailTemplateContext?: Record<string, any>;
  emailTemplatePath?: string;
  content: string;
  subject: string;
}

@CommandHandler(NotificationSendEmailCommand)
export class NotificationSendEmailCommandHandler
  implements ICommandHandler<NotificationSendEmailCommand>
{
  constructor(private readonly emailService: EmailService) {}

  async execute(command: NotificationSendEmailCommand) {
    if (
      command.email_type === 'template' &&
      !!command.emailTemplateContext &&
      !!command.emailTemplatePath
    ) {
      this.emailService.sendMail({
        subject: command.subject,
        mailType: command.email_type,
        templateContext: command.emailTemplateContext,
        templatePath: command.emailTemplatePath,
        to: command.email,
      });
    }

    if (command.email_type === 'plain') {
      this.emailService.sendMail({
        subject: command.subject,
        mailType: command.email_type,
        content: command.content,
        to: command.email,
      });
    }
  }
}
