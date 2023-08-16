import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';
import { SmsGatewayEntity } from '../../entities/sms.gateway.entity';

export class SmsConfigCreateCommand {
  api_key: string;
  user_sender: string;
  username: string;
}

export class SmsConfigCreateCommandResult {
  created_entity: SmsGatewayEntity;
}

@CommandHandler(SmsConfigCreateCommand)
export class SmsConfigCreateCommandHandler
  implements
    ICommandHandler<SmsConfigCreateCommand, SmsConfigCreateCommandResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    command: SmsConfigCreateCommand,
  ): Promise<SmsConfigCreateCommandResult> {
    const result = await this.smsConfigRepo.create({ ...command });

    return {
      created_entity: result,
    };
  }
}
