import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget } from '@prisma/client';
import { nanoid } from 'nanoid';
import { logUtil } from '../../../commons/utils/log-util';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
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
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    uploadedFilePath: string[],
  ) {
    this.logger.log(
      'info',
      `Creating proposal with payload: \n ${logUtil(createProposalPayload)}`,
    );
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log('info', 'creating proposal...');
          const proposal = await prisma.proposal.create({
            data: {
              ...createProposalPayload,
            },
          });

          if (proposal_item_budgets) {
            this.logger.log(
              'info',
              `Creating item budget with payload: \n ${logUtil(
                proposal_item_budgets,
              )}`,
            );
            await prisma.proposal_item_budget.createMany({
              data: proposal_item_budgets,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `Creating file manager history with payload: \n ${logUtil(
                fileManagerCreateManyPayload,
              )}`,
            );

            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          this.logger.log('info', `Creating proposal log`);
          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal.id,
              state: 'CLIENT',
              user_role: 'CLIENT',
            },
          });

          // console.log({ proposal });
          // throw new BadRequestException('debug');
          return proposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      this.logger.log(
        'info',
        `error on prisma occured deleting all uploaded files`,
      );
      if (uploadedFilePath && uploadedFilePath.length > 0) {
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
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
    updateProposalPayload: Prisma.proposalUncheckedUpdateInput,
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    deletedFileManagerUrls: string[],
    uploadedFilePath: string[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `updating proposal ${proposal_id} with payload of: \n ${logUtil(
              updateProposalPayload,
            )}`,
          );
          const proposal = await prisma.proposal.update({
            where: {
              id: proposal_id,
            },
            data: {
              ...updateProposalPayload,
            },
          });

          if (proposal_item_budgets && proposal_item_budgets.length > 0) {
            this.logger.log('info', `deleteing previous item budget`);
            await prisma.proposal_item_budget.deleteMany({
              where: {
                proposal_id: proposal.id,
              },
            });

            this.logger.log(
              'info',
              `creating new item budgets with payload of: \n ${logUtil(
                proposal_item_budgets,
              )}`,
            );
            await prisma.proposal_item_budget.createMany({
              data: proposal_item_budgets,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `Creating file manager history with payload: \n ${logUtil(
                fileManagerCreateManyPayload,
              )}`,
            );

            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
            this.logger.log(
              'info',
              `There's a file that unused / deleted, setting flags delete to: \n${logUtil(
                deletedFileManagerUrls,
              )}`,
            );
            for (let i = 0; i < deletedFileManagerUrls.length; i++) {
              const theFile = await prisma.file_manager.findUnique({
                where: {
                  url: deletedFileManagerUrls[i],
                },
              });

              if (theFile) {
                await prisma.file_manager.update({
                  where: {
                    id: theFile.id,
                  },
                  data: {
                    is_deleted: true,
                  },
                });
              }
            }
          }

          // console.log({ proposal });
          // throw new BadRequestException('debug');
          return proposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      this.logger.log(
        'info',
        'saving data on db failed, deleting all uploaded files for this proposal',
      );
      if (uploadedFilePath.length > 0) {
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'Saving Draft Proposal error details: ',
        'Saving Proposal Draft!',
      );
      throw theError;
    }
  }

  async deleteProposal(proposal_id: string, deletedFileManagerUrls: string[]) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
          this.logger.log(
            'info',
            `There's a file that unused / deleted, setting flags delete to: \n${logUtil(
              deletedFileManagerUrls,
            )}`,
          );
          for (let i = 0; i < deletedFileManagerUrls.length; i++) {
            const file = await prisma.file_manager.findUnique({
              where: { url: deletedFileManagerUrls[i] },
            });

            if (file) {
              await prisma.file_manager.update({
                where: { url: deletedFileManagerUrls[i] },
                data: { is_deleted: true },
              });
            }
          }
        }

        this.logger.log('info', `deleting proposal ${proposal_id}`);
        const deletedProposal = await prisma.proposal.delete({
          where: { id: proposal_id },
        });

        return deletedProposal;
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'Deleting Draft Proposal error details: ',
        'Deleting Draft Proposal!',
      );
      throw theError;
    }
  }

  async fetchProposalById(proposalId: string): Promise<proposal | null> {
    try {
      this.logger.log('info', `fetching proposal ${proposalId}`);
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
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
    createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    deletedRecommendedSupportIds: string[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prismaTrans) => {
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
                    (new Date().getTime() - lastLog.created_at.getTime()) /
                      60000,
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

          /* Crud item budget -------------------------------------------------------------------------- */
          if (createdItemBudgetPayload && createdItemBudgetPayload.length > 0) {
            await prismaTrans.proposal_item_budget.createMany({
              data: createdItemBudgetPayload,
            });
          }

          if (updatedItemBudgetPayload && updatedItemBudgetPayload.length > 0) {
            for (let i = 0; i < updatedItemBudgetPayload.length; i++) {
              const itemBudgetToUpdate =
                await prismaTrans.proposal_item_budget.findUnique({
                  where: {
                    id: updatedItemBudgetPayload[i].id as string,
                  },
                });
              if (!itemBudgetToUpdate) {
                throw new BadRequestException(
                  'please make sure that item budget that you trying to update is exist!',
                );
              }

              await prismaTrans.proposal_item_budget.update({
                where: {
                  id: updatedItemBudgetPayload[i].id as string,
                },
                data: {
                  ...updatedItemBudgetPayload[i],
                },
              });
            }
          }

          if (deletedItemBudgetIds && deletedItemBudgetIds.length > 0) {
            await prismaTrans.proposal_item_budget.deleteMany({
              where: {
                id: {
                  in: [...deletedItemBudgetIds],
                },
              },
            });
          }
          /* Crud item budget -------------------------------------------------------------------------- */

          /* Crud recommend support payload ------------------------------------------------------------ */
          if (
            createdRecommendedSupportPayload &&
            createdRecommendedSupportPayload.length > 0
          ) {
            await prismaTrans.recommended_support_consultant.createMany({
              data: createdRecommendedSupportPayload,
            });
          }

          if (
            updatedRecommendedSupportPayload &&
            updatedRecommendedSupportPayload.length > 0
          ) {
            for (let i = 0; i < updatedRecommendedSupportPayload.length; i++) {
              const itemBudgetToUpdate =
                await prismaTrans.recommended_support_consultant.findUnique({
                  where: {
                    id: updatedRecommendedSupportPayload[i].id as string,
                  },
                });
              if (!itemBudgetToUpdate) {
                throw new BadRequestException(
                  'please make sure that item budget that you trying to update is exist!',
                );
              }

              await prismaTrans.recommended_support_consultant.update({
                where: {
                  id: updatedRecommendedSupportPayload[i].id as string,
                },
                data: {
                  ...updatedRecommendedSupportPayload[i],
                },
              });
            }
          }

          if (
            deletedRecommendedSupportIds &&
            deletedRecommendedSupportIds.length > 0
          ) {
            await prismaTrans.recommended_support_consultant.deleteMany({
              where: {
                id: {
                  in: [...deletedRecommendedSupportIds],
                },
              },
            });
          }
          /* Crud recommend support payload ------------------------------------------------------------ */

          return {
            proposal,
            proposal_logs,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
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
