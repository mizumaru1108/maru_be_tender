import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackRepository } from '../../repositories/track.repository';
export class TrackUpdateCommand {
  id: string;
  name?: string;
  with_consultation?: boolean;
  is_deleted?: boolean;
}

export class TrackUpdateCommandResult {}

@CommandHandler(TrackUpdateCommand)
export class TrackUpdateCommandHandler
  implements ICommandHandler<TrackUpdateCommand, TrackUpdateCommandResult>
{
  constructor(private readonly trackRepo: TrackRepository) {}

  async execute(
    command: TrackUpdateCommand,
  ): Promise<TrackUpdateCommandResult> {
    try {
      const track = await this.trackRepo.findFirst({
        id: command.id,
      });
      if (!track) throw new NotFoundException('Track Not Found!');

      if (command.name && command.name !== track.name) {
        const track = await this.trackRepo.findFirst({
          name: command.name,
        });
        if (track) {
          throw new ConflictException(
            `Track with name of ${command.name} already exist!`,
          );
        }
      }

      const data = await this.trackRepo.update({ ...command });
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
