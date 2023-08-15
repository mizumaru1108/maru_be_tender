import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { AuthoritiesEntity } from '../../entities/authorities.entity';
import { AuthoritiesRepository } from '../../repositories/authorities.repository';
export class AuthoritiesUpdateCommand {
  authority_id: string;
  name?: string;
  client_field_id?: string;
}

export class AuthoritiesUpdateCommandResult {
  updated_authorities: AuthoritiesEntity;
}

@CommandHandler(AuthoritiesUpdateCommand)
export class AuthoritiesUpdateCommandHandler
  implements
    ICommandHandler<AuthoritiesUpdateCommand, AuthoritiesUpdateCommandResult>
{
  constructor(private readonly authoritiesRepo: AuthoritiesRepository) {}

  async execute(
    command: AuthoritiesUpdateCommand,
  ): Promise<AuthoritiesUpdateCommandResult> {
    try {
      const authority = await this.authoritiesRepo.findById(
        command.authority_id,
      );
      if (!authority)
        throw new DataNotFoundException(
          `Authority with id of ${command.authority_id} not found!`,
        );
      const res = await this.authoritiesRepo.update({ ...command });
      return {
        updated_authorities: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
