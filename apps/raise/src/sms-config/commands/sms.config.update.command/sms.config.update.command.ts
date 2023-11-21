import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SmsConfigRepository } from '../../repositories/sms.config.repository';
import { SmsGatewayEntity } from '../../entities/sms.gateway.entity';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { UnprocessableEntityException } from '@nestjs/common';

export class SmsConfigUpdateCommand {
  id: string;
  api_key?: string;
  user_sender?: string;
  username?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export class SmsConfigUpdateCommandResult {
  updated_entity: SmsGatewayEntity;
}

@CommandHandler(SmsConfigUpdateCommand)
export class SmsConfigUpdateCommandHandler
  implements
    ICommandHandler<SmsConfigUpdateCommand, SmsConfigUpdateCommandResult>
{
  constructor(private readonly smsConfigRepo: SmsConfigRepository) {}

  async execute(
    command: SmsConfigUpdateCommand,
  ): Promise<SmsConfigUpdateCommandResult> {
    try {
      const config = await this.smsConfigRepo.findById(command.id);
      if (!config) {
        throw new DataNotFoundException(
          `Sms Config with id of ${command.id} not found!`,
        );
      }

      if (config.is_active === false && command.is_active === true) {
        // find active config except the one that we want to update
        const activeConfig = await this.smsConfigRepo.findMany({
          is_active: true,
          exclude_id: [config.id],
        });

        if (activeConfig.length > 0) {
          throw new UnprocessableEntityException(
            'Only one active sms config is allowed!',
          );
        }
      }
      const res = await this.smsConfigRepo.update({ ...command });
      return {
        updated_entity: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
