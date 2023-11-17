import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackSectionSaveDto } from '../../dtos/requests/track.sections.save.dto';
import { TrackSectionEntity } from '../../entities/track.section.entity';
import { TrackSectionRepository } from '../../repositories/track.section.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { async } from 'rxjs';
import {
  SectionSupervisorRepository,
  SectionSupervisorSaveProps,
} from '../../../section-supervisor/repositories/section.supervisor.repository';
export class TrackSectionSaveCommand {
  sections: TrackSectionSaveDto[];
}

export class TrackSectionSaveCommandResult {
  data: {
    created_sections: TrackSectionSaveDto[];
  };
}

@CommandHandler(TrackSectionSaveCommand)
export class TrackSectionSaveCommandHandler
  implements
    ICommandHandler<TrackSectionSaveCommand, TrackSectionSaveCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trackSectionRepo: TrackSectionRepository,
    private readonly sectionSupervisorRepo: SectionSupervisorRepository,
  ) {}

  async execute(
    command: TrackSectionSaveCommand,
  ): Promise<TrackSectionSaveCommandResult> {
    const { sections } = command;
    try {
      // await this.prismaService.$transaction(
      //   async (session) => {
      //     const tx =
      //       session instanceof PrismaService ? session : this.prismaService;

      //   },
      //   {
      //     timeout: 120000,
      //   },
      // );

      let sectionSupervisorPayload: SectionSupervisorSaveProps[] = [];

      for (const section of sections) {
        if (section.supervisor_id) {
          sectionSupervisorPayload.push({
            section_id: section.id,
            supervisor_user_id: section.supervisor_id,
          });
        }
      }

      await this.prismaService.$transaction(
        async (session) => {
          const tx =
            session instanceof PrismaService ? session : this.prismaService;

          await this.trackSectionRepo.arraySave(
            sections[0].track_id,
            sections,
            tx,
          );

          if (sectionSupervisorPayload.length > 0) {
            await this.sectionSupervisorRepo.arraySave(
              sectionSupervisorPayload,
              tx,
            );
          }
        },
        {
          timeout: 50000,
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
