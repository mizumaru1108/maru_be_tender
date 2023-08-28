import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GovernorateRepository } from '../../repositories/governorate.repository';

export class GovernorateDeleteCommand {
  governorate_id: string[];
}

export class GovernorateDeleteCommandResult {
  messages: string;
}

@CommandHandler(GovernorateDeleteCommand)
export class GovernorateDeleteCommandHandler
  implements
    ICommandHandler<GovernorateDeleteCommand, GovernorateDeleteCommandResult>
{
  constructor(private readonly authoritiesRepo: GovernorateRepository) {}

  async execute(
    command: GovernorateDeleteCommand,
  ): Promise<GovernorateDeleteCommandResult> {
    try {
      const res = await this.authoritiesRepo.deleteMany(command.governorate_id);
      return {
        messages: `Deleted Count ${res}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
