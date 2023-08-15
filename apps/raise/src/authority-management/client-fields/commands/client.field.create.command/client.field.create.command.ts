import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientFieldEntity } from '../../entities/client.field.entity';
import { ClientFieldRepository } from '../../repositories/client.field.repository';
export class ClientFieldCreateCommand {
  name: string;
}

export class ClientFieldCreateCommandResult {
  created_entities: ClientFieldEntity;
}

@CommandHandler(ClientFieldCreateCommand)
export class ClientFieldCreateCommandHandler
  implements
    ICommandHandler<ClientFieldCreateCommand, ClientFieldCreateCommandResult>
{
  constructor(private readonly clientField: ClientFieldRepository) {}

  async execute(
    command: ClientFieldCreateCommand,
  ): Promise<ClientFieldCreateCommandResult> {
    const res = await this.clientField.create({ ...command });
    return {
      created_entities: res,
    };
  }
}
