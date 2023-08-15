import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthoritiesRepository } from '../../repositories/authorities.repository';
export class AuthoritiesDeleteCommand {
  authority_id: string[];
}

export class AuthoritiesDeleteCommandResult {
  messages: string;
}

@CommandHandler(AuthoritiesDeleteCommand)
export class AuthoritiesDeleteCommandHandler
  implements
    ICommandHandler<AuthoritiesDeleteCommand, AuthoritiesDeleteCommandResult>
{
  constructor(private readonly authoritiesRepo: AuthoritiesRepository) {}

  async execute(
    command: AuthoritiesDeleteCommand,
  ): Promise<AuthoritiesDeleteCommandResult> {
    try {
      const res = await this.authoritiesRepo.deleteMany(command.authority_id);
      return {
        messages: `Deleted Count ${res}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
