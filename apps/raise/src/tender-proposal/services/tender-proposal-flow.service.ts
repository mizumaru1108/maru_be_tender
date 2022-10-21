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
    const flow = await this.prismaService.project_tracks.findFirstOrThrow({
      where: {
        id: track_name,
      },
    });
    return flow;
  }
}
