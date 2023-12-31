import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { logUtil } from 'src/commons/utils/log-util';
import { EmailService } from 'src/libs/email/email.service';
export class NotificationSendEmailCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email: string;
  email_sender?: string;
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
  private readonly logger = new Logger(
    NotificationSendEmailCommandHandler.name,
  );
  constructor(private readonly emailService: EmailService) {}

  async execute(command: NotificationSendEmailCommand) {
    this.logger.debug(`send email command triggered ${logUtil(command)}`);
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
        from: command.email_sender,
      });
    }

    if (command.email_type === 'plain') {
      this.emailService.sendMail({
        subject: command.subject,
        mailType: command.email_type,
        content: command.content,
        to: command.email,
        from: command.email_sender,
      });
    }
  }
}
