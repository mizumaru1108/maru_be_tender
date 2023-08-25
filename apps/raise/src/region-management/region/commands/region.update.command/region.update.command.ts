import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { RegionEntity } from '../../entities/region.entity';
import { RegionRepository } from '../../repositories/region.repository';
export class RegionUpdateCommand {
  region_id: string;
  name?: string;
}

export class RegionUpdateCommandResult {
  data: RegionEntity;
}

@CommandHandler(RegionUpdateCommand)
export class RegionUpdateCommandHandler
  implements ICommandHandler<RegionUpdateCommand, RegionUpdateCommandResult>
{
  constructor(private readonly regionRepo: RegionRepository) {}

  async execute(
    command: RegionUpdateCommand,
  ): Promise<RegionUpdateCommandResult> {
    try {
      const data = await this.regionRepo.findById(command.region_id);
      if (!data)
        throw new DataNotFoundException(
          `Region with id of ${command.region_id} not found!`,
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
