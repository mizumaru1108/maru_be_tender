import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
export class NotificationSendSmsCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  phone_number?: string;
  content: string;
  subject: string;
}

@CommandHandler(NotificationSendSmsCommand)
export class NotificationSendSmsCommandHandler
  implements ICommandHandler<NotificationSendSmsCommand>
{
  private retryCount = 0;
  constructor(private readonly msegatService: MsegatService) {}
  async sendSms(command: NotificationSendSmsCommand) {}
  async execute(command: NotificationSendSmsCommand): Promise<any> {}
}
