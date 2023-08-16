import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';
export class SmsConfigDeleteCommand {
  id: string[];
}

export class SmsConfigDeleteCommandResult {
  messages: string;
}

@CommandHandler(SmsConfigDeleteCommand)
export class SmsConfigDeleteCommandHandler
  implements
    ICommandHandler<SmsConfigDeleteCommand, SmsConfigDeleteCommandResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    command: SmsConfigDeleteCommand,
  ): Promise<SmsConfigDeleteCommandResult> {
    try {
      const res = await this.smsConfigRepo.deleteMany(command.id);
      return {
        messages: `Deleted Count ${res}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
