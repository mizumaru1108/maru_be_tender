import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegionRepository } from '../../repositories/region.repository';

export class RegionDeleteCommand {
  region_id: string[];
}

export class RegionDeleteCommandResult {
  messages: string;
}

@CommandHandler(RegionDeleteCommand)
export class RegionDeleteCommandHandler
  implements ICommandHandler<RegionDeleteCommand, RegionDeleteCommandResult>
{
  constructor(private readonly authoritiesRepo: RegionRepository) {}

  async execute(
    command: RegionDeleteCommand,
  ): Promise<RegionDeleteCommandResult> {
    try {
      const res = await this.authoritiesRepo.deleteMany(command.region_id);
      return {
        messages: `Deleted Count ${res}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
