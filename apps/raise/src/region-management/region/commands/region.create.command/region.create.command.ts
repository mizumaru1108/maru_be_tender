import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegionEntity } from '../../entities/region.entity';
import { RegionRepository } from '../../repositories/region.repository';
export class RegionCreateCommand {
  name: string;
}

export class RegionCreateCommandResult {
  data: RegionEntity;
}

@CommandHandler(RegionCreateCommand)
export class RegionCreateCommandHandler
  implements ICommandHandler<RegionCreateCommand, RegionCreateCommandResult>
{
  constructor(private readonly regionRepo: RegionRepository) {}

  async execute(
    command: RegionCreateCommand,
  ): Promise<RegionCreateCommandResult> {
    const res = await this.regionRepo.create({ ...command });
    return {
      data: res,
    };
  }
}
