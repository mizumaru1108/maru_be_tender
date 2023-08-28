import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GovernorateEntity } from '../../entities/governorate.entity';
import { GovernorateRepository } from '../../repositories/governorate.repository';
export class GovernorateCreateCommand {
  region_id: string;
  name: string;
}

export class GovernorateCreateCommandResult {
  data: GovernorateEntity;
}

@CommandHandler(GovernorateCreateCommand)
export class GovernorateCreateCommandHandler
  implements
    ICommandHandler<GovernorateCreateCommand, GovernorateCreateCommandResult>
{
  constructor(private readonly regionRepo: GovernorateRepository) {}

  async execute(
    command: GovernorateCreateCommand,
  ): Promise<GovernorateCreateCommandResult> {
    const res = await this.regionRepo.create({ ...command });
    return {
      data: res,
    };
  }
}
