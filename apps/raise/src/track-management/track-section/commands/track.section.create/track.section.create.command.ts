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
    created_sections: TrackSectionCreateDto[];
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

          await this.trackSectionRepo.arraySave(
            sections[0].track_id,
            sections,
            tx,
          );
        },
        {
          timeout: 70000,
        },
      );

      return {
        data: {
          created_sections: sections,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
