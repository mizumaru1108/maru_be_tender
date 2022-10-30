import { Injectable } from '@nestjs/common';
import { project_tracks } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalFlowService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProposalLog() {
    console.log('createProposalLog');
  }

  async getFlow(track_name: string): Promise<project_tracks> {
    // default flow will have client and moderator as the first two step
    // then the moderator will dtermine the track, after it's determined
    // the flow will be determined by the track
    const flow = await this.prismaService.project_tracks.findFirstOrThrow({
      where: {
        id: track_name,
      },
    });
    return flow;
  }
}
