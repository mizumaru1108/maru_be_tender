import { Injectable, NotFoundException } from '@nestjs/common';
import { project_track_flows } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderAppRole } from '../../tender-commons/types';
import { TenderProposalFlowRepository } from '../repositories/tender-proposal-flow.repository';

@Injectable()
export class TenderProposalFlowService {
  constructor(
    private readonly tenderProposalFlowRepository: TenderProposalFlowRepository,
  ) {}

  async fetchTrack(
    state: TenderAppRole,
    track_name: string,
    defaultTrack: boolean,
  ): Promise<project_track_flows> {
    if (defaultTrack) {
      const currentTrack =
        await this.tenderProposalFlowRepository.fetchCurrentTrack(
          state,
          'DEFAULT_TRACK',
        );
      if (!currentTrack) throw new NotFoundException('Track not found');

      const nextTrack = await this.tenderProposalFlowRepository.fetchNextTrack(
        currentTrack.step_position! + 1,
        track_name,
      );
      if (!nextTrack) throw new NotFoundException('Track not found');

      return nextTrack;
    } else {
      const currentTrack =
        await this.tenderProposalFlowRepository.fetchCurrentTrack(
          state,
          track_name,
        );

      if (!currentTrack)
        throw new NotFoundException(
          `There's no ${state} roles in ${track_name} track, please check your ${track_name} flow`,
        );

      const nextTrack = await this.tenderProposalFlowRepository.fetchNextTrack(
        currentTrack.step_position! + 1,
        track_name,
      );

      if (!nextTrack)
        throw new NotFoundException(
          `Next track not found after step number ${currentTrack.step_position}, in ${track_name} track`,
        );

      return nextTrack;
    }
  }
}
