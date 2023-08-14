import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntitiesEntity } from '../../entities/entities.entity';
import { EntitiesRepository } from '../../repositories/entities.repository';
export class EntitiesCreateCommand {
  name: string;
  authority_id: string;
}

export class EntitiesCreateCommandResult {
  created_entities: EntitiesEntity;
}

@CommandHandler(EntitiesCreateCommand)
export class EntitiesCreateCommandHandler
  implements
    ICommandHandler<EntitiesCreateCommand, EntitiesCreateCommandResult>
{
  constructor(private readonly entitiesRepo: EntitiesRepository) {}

  async execute(
    command: EntitiesCreateCommand,
  ): Promise<EntitiesCreateCommandResult> {
    const res = await this.entitiesRepo.create({ ...command });
    return {
      created_entities: res,
    };
  }
}
