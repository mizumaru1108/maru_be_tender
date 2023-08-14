import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthoritiesRepository } from '../../repositories/authorities.repository';
import { AuthoritiesEntity } from '../../entities/authorities.entity';
import { ApiProperty } from '@nestjs/swagger';
export class AuthoritiesCreateCommand {
  name: string;
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
