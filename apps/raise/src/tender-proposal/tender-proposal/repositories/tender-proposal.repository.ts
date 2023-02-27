import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Prisma,
  proposal,
  proposal_edit_request,
  proposal_item_budget,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { UserDefinedMessageList } from 'twilio/lib/rest/api/v2010/account/call/userDefinedMessage';
import { logUtil } from '../../../commons/utils/log-util';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderAppRoleEnum } from '../../../tender-commons/types';
import { ProposalAction } from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { FetchAmandementFilterRequest } from '../dtos/requests/fetch-amandement-filter-request.dto';
import { UpdateMyProposalResponseDto } from '../dtos/responses/update-my-proposal-response.dto';
import { NewAmandementNotifMapper } from '../mappers/new-amandement-notif-mapper';
import { SendRevisionNotifMapper } from '../mappers/send-revision-notif-mapper';
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

  async updateMyProposal(
    proposal_id: string,
    updateProposalPayload: Prisma.proposalUncheckedUpdateInput,
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    deletedFileManagerUrls: string[],
    uploadedFilePath: string[],
    createLog: boolean,
  ): Promise<UpdateMyProposalResponseDto> {
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

          if (createLog) {
            const createdLog = await prisma.proposal_log.create({
              data: {
                id: nanoid(),
                proposal_id,
                user_role: TenderAppRoleEnum.CLIENT,
                action: ProposalAction.SEND_REVISED_VERSION, //revised
                state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
                notes: 'Proposal has been revised',
              },
              select: {
                action: true,
                created_at: true,
                proposal: {
                  select: {
                    project_name: true,
                    user: {
                      select: {
                        id: true,
                        employee_name: true,
                        email: true,
                        mobile_number: true,
                      },
                    },
                    supervisor: {
                      select: {
                        id: true,
                        employee_name: true,
                        email: true,
                        mobile_number: true,
                      },
                    },
                  },
                },
              },
            });

            const sendRevisionNotif = SendRevisionNotifMapper({
              ...createdLog,
              reviewer: createdLog.proposal.supervisor,
            });

            if (
              sendRevisionNotif.createManyWebNotifPayload &&
              sendRevisionNotif.createManyWebNotifPayload.length > 0
            ) {
              this.logger.log(
                'info',
                `Creating new notification for revision sent, with payload of \n${sendRevisionNotif.createManyWebNotifPayload}`,
              );
              prisma.notification.createMany({
                data: sendRevisionNotif.createManyWebNotifPayload,
              });
            }

            return {
              proposal,
              notif: sendRevisionNotif,
            };
          }

          return {
            proposal,
            notif: undefined,
          };
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

  async sendAmandement(
    id: string,
    reviewer_id: string,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    createProposalEditRequestPayload: Prisma.proposal_edit_requestUncheckedCreateInput,
    notes: string,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `Updating proposal ${id}, with payload of\n${logUtil(
              proposalUpdatePayload,
            )}`,
          );
          const updatedProposal = await prisma.proposal.update({
            where: { id },
            data: proposalUpdatePayload,
          });

          this.logger.log(
            'info',
            `Creating new proposal edit request with payload of \n${logUtil(
              createProposalEditRequestPayload,
            )}`,
          );

          this.logger.log(
            'info',
            `Find existing edit request by proposal id of ${id}`,
          );
          const oldData = await prisma.proposal_edit_request.findFirst({
            where: { proposal_id: id },
          });
          if (oldData) {
            this.logger.log(
              'info',
              `deleting old proposal edit request with porposal id of ${id}`,
            );
            await prisma.proposal_edit_request.delete({
              where: { proposal_id: id },
            });
          }

          this.logger.log(
            'info',
            `creating new proposal edit request with payload of ${createProposalEditRequestPayload}`,
          );
          await prisma.proposal_edit_request.create({
            data: createProposalEditRequestPayload,
          });

          const lastLog = await prisma.proposal_log.findFirst({
            where: { proposal_id: id },
            select: {
              created_at: true,
            },
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          });

          const createdLog = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: id,
              user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              reviewer_id,
              action: ProposalAction.SEND_BACK_FOR_REVISION, //revised
              state: TenderAppRoleEnum.CLIENT,
              notes: notes,
              response_time: lastLog?.created_at
                ? Math.round(
                    (new Date().getTime() - lastLog.created_at.getTime()) /
                      60000,
                  )
                : null,
            },
            select: {
              action: true,
              created_at: true,
              reviewer: {
                select: {
                  id: true,
                  employee_name: true,
                  email: true,
                  mobile_number: true,
                },
              },
              proposal: {
                select: {
                  project_name: true,
                  user: {
                    select: {
                      id: true,
                      employee_name: true,
                      email: true,
                      mobile_number: true,
                    },
                  },
                },
              },
            },
          });

          const sendAmandementNotif = NewAmandementNotifMapper(createdLog);
          if (
            sendAmandementNotif.createManyWebNotifPayload &&
            sendAmandementNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `Creating new notification with payload of \n${logUtil(
                sendAmandementNotif.createManyWebNotifPayload,
              )}`,
            );
            prisma.notification.createMany({
              data: sendAmandementNotif.createManyWebNotifPayload,
            });
          }

          return {
            updatedProposal,
            sendAmandementNotif,
          };
        },
        { maxWait: 500000, timeout: 1500000 },
      );
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalRepository.name,
        'Send Amandement error details: ',
        'Sending Amandement!',
      );
      throw theError;
    }
  }

  async findAmandementByProposalId(proposal_id: string): Promise<any> {
    try {
      this.logger.log(
        'info',
        `Finding amandement with proposal_id of ${proposal_id}`,
      );
      return await this.prismaService.proposal_edit_request.findFirst({
        where: {
          proposal_id: proposal_id,
        },
        select: {
          detail: true,
          proposal: {
            select: {
              id: true,
              project_implement_date: true,
              project_location: true,
              num_ofproject_binicficiaries: true,
              project_idea: true,
              project_goals: true,
              project_outputs: true,
              project_strengths: true,
              project_risks: true,
              amount_required_fsupport: true,
              letter_ofsupport_req: true,
              project_attachments: true,
              project_beneficiaries: true,
              project_name: true,
              execution_time: true,
              project_beneficiaries_specific_type: true,
              pm_name: true,
              pm_mobile: true,
              pm_email: true,
              region: true,
              governorate: true,
              proposal_item_budget: true,
            },
          },
        },
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalRepository.name,
        'Send Amandement error details: ',
        'Sending Amandement!',
      );
      throw theError;
    }
  }

  async findAmandementDetailByProposalId(
    proposalId: string,
  ): Promise<{ detail: string } | null> {
    try {
      this.logger.log(
        'info',
        `Finding amandement with proposal id of ${proposalId}`,
      );
      const raw = await this.prismaService.$queryRaw<
        { detail: string }[]
      >`SELECT detail FROM proposal_edit_request WHERE proposal_id = ${proposalId}`;
      return raw[0] || null;
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalRepository.name,
        'Find Amandement By ProposalId error details: ',
        'Finding Amandement By ProposalId!',
      );
      throw theError;
    }
  }

  async findAmandementList(
    currentUser: TenderCurrentUser,
    filter: FetchAmandementFilterRequest,
  ) {
    try {
      const { entity, project_name, page = 1, limit = 10 } = filter;
      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposal_edit_requestWhereInput = {};

      if (currentUser.choosenRole === 'tender_project_supervisor') {
        whereClause = {
          ...whereClause,
          reviewer_id: currentUser.id,
        };
      } else {
        whereClause = {
          ...whereClause,
          user_id: currentUser.id,
        };
      }

      if (entity) {
        whereClause = {
          ...whereClause,
          user: {
            client_data: {
              entity: {
                contains: entity,
                mode: 'insensitive',
              },
            },
          },
        };
      }

      if (project_name) {
        whereClause = {
          ...whereClause,
          proposal: {
            project_name: {
              contains: project_name,
              mode: 'insensitive',
            },
          },
        };
      }

      const data = await this.prismaService.proposal_edit_request.findMany({
        where: whereClause,
        select: {
          id: true,
          user: { select: { employee_name: true } },
          reviewer: { select: { employee_name: true } },
          proposal: { select: { id: true, project_name: true } },
          created_at: true,
        },
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'desc',
        },
      });

      const total = await this.prismaService.proposal_edit_request.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchProposalById(proposalId: string): Promise<proposal | null> {
    try {
      this.logger.log('info', `fetching proposal ${proposalId}`);
      return await this.prismaService.proposal.findFirst({
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

    const query: Prisma.project_tracksWhereInput = {
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
