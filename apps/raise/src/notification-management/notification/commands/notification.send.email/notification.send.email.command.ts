import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class NotificationSendEmailCommand {}

@CommandHandler(NotificationSendEmailCommand)
export class NotificationSendEmailCommandHandler
  implements ICommandHandler<NotificationSendEmailCommand>
{
  constructor() {}
  async execute(command: NotificationSendEmailCommand): Promise<any> {}
}
