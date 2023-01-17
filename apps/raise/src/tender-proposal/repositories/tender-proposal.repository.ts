import { Injectable } from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
@Injectable()
export class TenderProposalRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async createProposal() {}

  async fetchProposalById(proposalId: string): Promise<proposal | null> {
    try {
      return await this.prismaService.proposal.findUnique({
        where: {
          id: proposalId,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchProposalById error details: ',
        'finding proposal!',
      );
      throw theError;
    }
  }

  async updateStepFour(
    proposalId: string,
    itemBudgetPayloads: proposal_item_budget[],
  ) {
    try {
      await this.prismaService.$transaction([
        // delete all previous item budget
        this.prismaService.proposal_item_budget.deleteMany({
          where: {
            proposal_id: proposalId,
          },
        }),
        // create a new one
        this.prismaService.proposal_item_budget.createMany({
          data: itemBudgetPayloads,
        }),
      ]);
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'updateStepFour error details: ',
        'updating proposal step four!',
      );
      throw theError;
    }
  }

  async updateProposal(
    proposalId: string,
    proposalPayload: Prisma.proposalUpdateInput,
    itemBudgetPayloads?: proposal_item_budget[] | null,
  ) {
    try {
      if (itemBudgetPayloads) {
        return await this.prismaService.$transaction([
          // delete all previous item budget
          this.prismaService.proposal_item_budget.deleteMany({
            where: {
              proposal_id: proposalId,
            },
          }),
          // create a new one
          this.prismaService.proposal_item_budget.createMany({
            data: itemBudgetPayloads,
          }),
          // update the proposal
          this.prismaService.proposal.update({
            where: {
              id: proposalId,
            },
            data: proposalPayload,
          }),
        ]);
      } else {
        return await this.prismaService.proposal.update({
          where: {
            id: proposalId,
          },
          data: proposalPayload,
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async updateProposalState(
    proposalId: string,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
  ) {
    try {
      return await this.prismaService.$transaction(async (prismaTrans) => {
        const proposal = await prismaTrans.proposal.update({
          where: {
            id: proposalId,
          },
          data: proposalUpdatePayload,
        });

        const proposal_logs = await prismaTrans.proposal_log.create({
          data: proposalLogCreateInput,
          include: {
            proposal: {
              select: {
                id: true,
                project_name: true,
                submitter_user_id: true,
                user: {
                  select: {
                    employee_name: true,
                    email: true,
                    mobile_number: true,
                  },
                },
              },
            },
            reviewer: {
              select: {
                employee_name: true,
                email: true,
                mobile_number: true,
              },
            },
          },
        });

        return {
          proposal,
          proposal_logs,
        };
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'updateProposalState error details: ',
        'updating proposal state!',
      );
      throw theError;
    }
  }

  async fetchTrack(limit: number, page: number) {
    const offset = (page - 1) * limit;

    let query: Prisma.project_tracksWhereInput = {
      id: { notIn: ['DEFAULT_TRACK', 'GENERAL'] },
    };

    try {
      const tracks = await this.prismaService.project_tracks.findMany({
        where: {
          ...query,
        },
        select: {
          id: true,
        },
        take: limit,
        skip: offset,
      });

      const count = await this.prismaService.project_tracks.count({
        where: {
          ...query,
        },
      });

      return {
        data: tracks,
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchTrack Error:',
        `fetching proposal tracks!`,
      );
      throw theError;
    }
  }

  async findTrackById(id: string) {
    try {
      return await this.prismaService.project_tracks.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchTracks Error:',
        `fetching proposal tracks!`,
      );
      throw theError;
    }
  }
}
