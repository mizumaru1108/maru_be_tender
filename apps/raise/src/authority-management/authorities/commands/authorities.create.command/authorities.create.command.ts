import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthoritiesEntity } from '../../entities/authorities.entity';
import { AuthoritiesRepository } from '../../repositories/authorities.repository';
export class AuthoritiesCreateCommand {
  name: string;
  client_field_id: string;
}

export class AuthoritiesCreateCommandResult {
  created_authorities: AuthoritiesEntity;
}

@CommandHandler(AuthoritiesCreateCommand)
export class AuthoritiesCreateCommandHandler
  implements
    ICommandHandler<AuthoritiesCreateCommand, AuthoritiesCreateCommandResult>
{
  constructor(private readonly authoritiesRepo: AuthoritiesRepository) {}

  async execute(
    command: AuthoritiesCreateCommand,
  ): Promise<AuthoritiesCreateCommandResult> {
    const res = await this.authoritiesRepo.create({ ...command });
    return {
      created_authorities: res,
    };
  }
}
