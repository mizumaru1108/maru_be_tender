import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TrackSectionCreateProps,
  TrackSectionRepository,
} from '../../repositories/track.section.repository';
import { Builder } from 'builder-pattern';
import { TrackSectionEntity } from '../../entities/track.section.entity';
export class TrackSectionCreateCommand {
  name: string;
  budget: number;
  track_ids: string[];
}

export class TrackSectionCreateCommandResult {
  data: {
    created_sections: TrackSectionEntity[];
  };
}

@CommandHandler(TrackSectionCreateCommand)
export class TrackSectionCreateCommandHandler
  implements
    ICommandHandler<TrackSectionCreateCommand, TrackSectionCreateCommandResult>
{
  constructor(private readonly trackSectionRepo: TrackSectionRepository) {}

  async execute(
    command: TrackSectionCreateCommand,
  ): Promise<TrackSectionCreateCommandResult> {
    try {
      const createdSection: TrackSectionEntity[] = [];
      for (const track_id of command.track_ids) {
        const section = await this.trackSectionRepo.create({
          name: command.name,
          budget: command.budget,
          track_id: track_id,
        });
        createdSection.push(section);
      }

      return {
        data: {
          created_sections: createdSection,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
