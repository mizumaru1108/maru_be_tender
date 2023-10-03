import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackSectionCreateDto } from '../../dtos/requests/track.sections.create.dto';
import { TrackSectionEntity } from '../../entities/track.section.entity';
import { TrackSectionRepository } from '../../repositories/track.section.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
export class TrackSectionCreateCommand {
  sections: TrackSectionCreateDto[];
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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trackSectionRepo: TrackSectionRepository,
  ) {}

  async execute(
    command: TrackSectionCreateCommand,
  ): Promise<TrackSectionCreateCommandResult> {
    const { sections } = command;
    try {
      const dbRes = await this.prismaService.$transaction(
        async (session) => {
          const tx =
            session instanceof PrismaService ? session : this.prismaService;

          await this.trackSectionRepo.deleteByTrackId(sections[0].track_id, tx);

          const createdEntity: TrackSectionEntity[] = [];
          for (const section of sections) {
            const entity = await this.trackSectionRepo.create(
              {
                id: section.id,
                name: section.name,
                budget: section.budget,
                parent_section_id: section.parent_section_id,
                track_id: section.track_id,
              },
              tx,
            );
            createdEntity.push(entity);
          }

          return createdEntity;
        },
        {
          timeout: 70000,
        },
      );

      return {
        data: {
          created_sections: dbRes,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
