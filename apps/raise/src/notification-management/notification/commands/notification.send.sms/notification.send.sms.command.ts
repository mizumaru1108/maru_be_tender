import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class NotificationSendSmsCommand {}

@CommandHandler(NotificationSendSmsCommand)
export class NotificationSendSmsCommandHandler
  implements ICommandHandler<NotificationSendSmsCommand>
{
  constructor() {}
  async execute(command: NotificationSendSmsCommand): Promise<any> {}
}
