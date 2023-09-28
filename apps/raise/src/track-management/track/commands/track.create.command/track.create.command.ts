import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackEntity } from '../../entities/track.entity';
import { TrackRepository } from '../../repositories/track.repository';
export class TrackCreateCommandCommand {
  name: string;
  with_consultation: boolean;
}

export class TrackCreateCommandCommandResult {
  data: TrackEntity;
}

@CommandHandler(TrackCreateCommandCommand)
export class TrackCreateCommandCommandHandler
  implements
    ICommandHandler<TrackCreateCommandCommand, TrackCreateCommandCommandResult>
{
  constructor(private readonly trackRepo: TrackRepository) {}

  async execute(
    command: TrackCreateCommandCommand,
  ): Promise<TrackCreateCommandCommandResult> {
    try {
      const track = await this.trackRepo.findFirst({
        name: command.name,
      });
      if (track) {
        throw new ConflictException(
          `Track with name of ${command.name} already exist!`,
        );
      }
      const data = await this.trackRepo.create({
        ...command,
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
