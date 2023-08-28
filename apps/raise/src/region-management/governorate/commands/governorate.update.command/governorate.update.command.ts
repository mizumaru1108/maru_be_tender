import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { GovernorateRepository } from '../../repositories/governorate.repository';
import { GovernorateEntity } from '../../entities/governorate.entity';

export class GovernorateUpdateCommand {
  governorate_id: string;
  region_id?: string;
  name?: string;
}

export class GovernorateUpdateCommandResult {
  data: GovernorateEntity;
}

@CommandHandler(GovernorateUpdateCommand)
export class GovernorateUpdateCommandHandler
  implements
    ICommandHandler<GovernorateUpdateCommand, GovernorateUpdateCommandResult>
{
  constructor(private readonly regionRepo: GovernorateRepository) {}

  async execute(
    command: GovernorateUpdateCommand,
  ): Promise<GovernorateUpdateCommandResult> {
    try {
      const data = await this.regionRepo.findById(command.governorate_id);
      if (!data)
        throw new DataNotFoundException(
          `Governorate with id of ${command.region_id} not found!`,
        );
      const res = await this.regionRepo.update({ ...command });
      return {
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
