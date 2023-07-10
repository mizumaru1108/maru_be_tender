import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
export class NotificationSendSmsCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  email?: string;
  phone_number?: string;
  content: string;
  subject: string;
}

@CommandHandler(NotificationSendSmsCommand)
export class NotificationSendSmsCommandHandler
  implements ICommandHandler<NotificationSendSmsCommand>
{
  constructor(private readonly msegatService: MsegatService) {}
  async execute(command: NotificationSendSmsCommand): Promise<any> {}
}
