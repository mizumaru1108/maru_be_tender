import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { project_track_flows } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalFlowRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // fetch current track
  async fetchCurrentTrack(
    state: string,
    track_name: string,
  ): Promise<project_track_flows | null> {
    try {
      return await this.prismaService.project_track_flows.findFirst({
        where: {
          assigned_to: state,
          belongs_to_track: track_name,
        },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(error);
    }
  }

  // fetch next track
  async fetchNextTrack(stepPosition: number, trackName: string) {
    try {
      return await this.prismaService.project_track_flows.findFirst({
        where: {
          step_position: stepPosition,
          belongs_to_track: trackName,
        },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(error);
    }
  }
}
