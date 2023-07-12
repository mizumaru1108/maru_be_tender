import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class ProposalFollowUpCreateCommand {}

export class ProposalFollowUpCreateCommandResult {}

@CommandHandler(ProposalFollowUpCreateCommand)
export class ProposalFollowUpCreateCommandHandler
  implements
    ICommandHandler<
      ProposalFollowUpCreateCommand,
      ProposalFollowUpCreateCommandResult
    >
{
  constructor() {}
  async execute(
    command: ProposalFollowUpCreateCommand,
  ): Promise<ProposalFollowUpCreateCommandResult> {}
}
