import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class UserUpdateStatusCommand {}

export class UserUpdateStatusCommandResult {}

@CommandHandler(UserUpdateStatusCommand)
export class UserUpdateStatusCommandHandler
  implements
    ICommandHandler<UserUpdateStatusCommand, UserUpdateStatusCommandResult>
{
  constructor() {}
  async execute(command: UserUpdateStatusCommand): Promise<any> {}
}
