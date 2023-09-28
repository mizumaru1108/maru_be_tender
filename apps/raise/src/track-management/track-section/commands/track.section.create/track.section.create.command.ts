import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackSectionRepository } from '../../repositories/track.section.repository';
export class TrackSectionCreateCommand {}

export class TrackSectionCreateCommandResult {}

@CommandHandler(TrackSectionCreateCommand)
export class TrackSectionCreateCommandHandler
  implements
    ICommandHandler<TrackSectionCreateCommand, TrackSectionCreateCommandResult>
{
  constructor(private readonly trackSectionRepo: TrackSectionRepository) {}

  async execute(
    command: TrackSectionCreateCommand,
  ): Promise<TrackSectionCreateCommandResult> {
    return new TrackSectionCreateCommandResult();
  }
}
