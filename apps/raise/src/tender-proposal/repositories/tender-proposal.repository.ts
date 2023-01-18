import { Injectable } from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget } from '@prisma/client';
import { nanoid } from 'nanoid';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
@Injectable()
export class TenderProposalRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalRepository.name,
  });
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
  ) {}

  async validateOwnBankAccount(user_id: string, bank_id: string) {
    try {
      const bankAccount = await this.prismaService.bank_information.findFirst({
        where: {
          user_id,
          id: bank_id,
        },
      });
      return bankAccount;
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

  async create(
    createProposalPayload: Prisma.proposalUncheckedCreateInput,
    project_attachment_path: string | undefined,
    letter_of_support_path: string | undefined,
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
  ) {
    this.logger.log(
      'info',
      'Creating proposal with payload: ',
      createProposalPayload,
    );
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          const proposal = await prisma.proposal.create({
            data: {
              ...createProposalPayload,
            },
          });

          if (proposal_item_budgets) {
            await prisma.proposal_item_budget.createMany({
              data: proposal_item_budgets,
            });
          }

          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal.id,
              state: 'CLIENT',
              user_role: 'CLIENT',
            },
          });
          return proposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      // if error
      if (project_attachment_path) {
        this.logger.log(
          'info',
          'Proposal failed to be created, deleting project attachemmt!',
        );
        await this.bunnyService.deleteMedia(project_attachment_path, true);
      }
      if (letter_of_support_path) {
        this.logger.log(
          'info',
          'Proposal failed to be created, deleting letter of support!',
        );
        await this.bunnyService.deleteMedia(letter_of_support_path, true);
      }
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchProposalById error details: ',
        'finding proposal!',
      );
      throw theError;
    }
  }

  async saveDraft(
    proposal_id: string,
    createProposalPayload: Prisma.proposalUncheckedUpdateInput,
    project_attachment_path: string | undefined,
    letter_of_support_path: string | undefined,
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          const proposal = await prisma.proposal.update({
            where: {
              id: proposal_id,
            },
            data: {
              ...createProposalPayload,
            },
          });

          if (proposal_item_budgets) {
            await prisma.proposal_item_budget.deleteMany({
              where: {
                proposal_id: proposal.id,
              },
            });

            await prisma.proposal_item_budget.createMany({
              data: proposal_item_budgets,
            });
          }

          return proposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      // if error delete all media
      if (project_attachment_path) {
        await this.bunnyService.deleteMedia(project_attachment_path, true);
      }
      if (letter_of_support_path) {
        await this.bunnyService.deleteMedia(letter_of_support_path, true);
      }
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchProposalById error details: ',
        'finding proposal!',
      );
      throw theError;
    }
  }

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
    lastLog: {
      created_at: Date;
    } | null,
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
          data: {
            ...proposalLogCreateInput,
            // get the last log.created_at, and create a new date, compare the time difference, and convert to minutes, if last log is null, then response time is null
            response_time: lastLog
              ? Math.round(
                  (new Date().getTime() - lastLog.created_at.getTime()) / 60000,
                )
              : null,
          },
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
