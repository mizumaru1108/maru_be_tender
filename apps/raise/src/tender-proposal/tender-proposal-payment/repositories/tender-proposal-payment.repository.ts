import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cheque, payment, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { logUtil } from '../../../commons/utils/log-util';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
} from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { InsertPaymentNotifMapper } from '../mappers/insert-payment-notif.mapper';
import { UpdatePaymentNotifMapper } from '../mappers/update-payment-notif.mapper';

@Injectable()
export class TenderProposalPaymentRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalPaymentRepository.name,
  });
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
  ) {}

  async findPaymentById(id: string): Promise<payment | null> {
    this.logger.debug(`finding payment by id of ${id}... `);
    try {
      return await this.prismaService.payment.findUnique({
        where: { id },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'findPaymentById error details: ',
        'finding payment!',
      );
      throw theError;
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    paymentStatus: string | null,
  ): Promise<payment | null> {
    this.logger.debug(`updating payment by id of ${paymentId}...`);
    try {
      return await this.prismaService.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: paymentStatus,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'updatePaymentStatus error details: ',
        'updating payment status!',
      );
      throw theError;
    }
  }

  async insertPayment(
    proposal_id: string,
    reviewer_id: string,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    createManyPaymentPayload: Prisma.paymentCreateManyInput[],
    lastLog: {
      created_at: Date;
    } | null,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `updating proposal ${proposal_id} with payload of \n ${logUtil(
              proposalUpdatePayload,
            )}`,
          );

          const updatedProposal = await prisma.proposal.update({
            where: { id: proposal_id },
            data: proposalUpdatePayload,
          });

          this.logger.log('info', `Creating Proposal Log`);
          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: 'accept',
              reviewer_id,
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              response_time: lastLog
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

          const insertNotif = InsertPaymentNotifMapper(logs);
          if (
            insertNotif.createManyWebNotifPayload &&
            insertNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `Creating new notification with payload of \n${insertNotif.createManyWebNotifPayload}`,
            );
            prisma.notification.createMany({
              data: insertNotif.createManyWebNotifPayload,
            });
          }

          this.logger.log(
            'info',
            `creating payments with payload of \n${logUtil(
              createManyPaymentPayload,
            )}`,
          );
          await this.prismaService.payment.createMany({
            data: createManyPaymentPayload,
          });

          return {
            insertNotif,
            updatedProposal,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'createManyPayment error details: ',
        'creating payment!',
      );
      throw theError;
    }
  }

  async findPaymentsByProposalId(proposal_id: string, only_completed: boolean) {
    this.logger.debug(
      `finding all proposal payment with proposal id of ${proposal_id}...`,
    );

    let whereClause: Prisma.paymentWhereInput = { proposal_id };

    if (only_completed) {
      whereClause = {
        ...whereClause,
        status: 'DONE',
      };
    }

    try {
      return await this.prismaService.payment.findMany({
        where: { proposal_id },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'Finding Payments error details: ',
        'Finding Payments!',
      );
      throw theError;
    }
  }

  async updatePayment(
    paymentId: string,
    status: string | null,
    action: 'accept' | 'reject' | 'edit' | 'upload_receipt' | 'issue',
    reviewerId: string,
    choosenRole: TenderAppRole,
    chequeCreatePayload: Prisma.chequeUncheckedCreateInput | undefined,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    lastLog: {
      created_at: Date;
    } | null,
    proposalUpdateInput: Prisma.proposalUpdateInput,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `updating payment status of ${paymentId} to ${status}`,
          );
          const payment = await prisma.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status,
            },
          });

          let cheque: cheque | null = null;
          if (chequeCreatePayload) {
            this.logger.log(
              'info',
              `creating cheque records with payload of\n${chequeCreatePayload}`,
            );
            cheque = await prisma.cheque.create({
              data: chequeCreatePayload,
            });
          }

          if (Object.keys(proposalUpdateInput).length > 0) {
            this.logger.log(
              'info',
              `updating proposal with payload of \n${proposalUpdateInput}`,
            );
            await prisma.proposal.update({
              where: {
                id: payment.proposal_id,
              },
              data: proposalUpdateInput,
            });
          }

          this.logger.log('info', `Creating Proposal Log`);
          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: payment.proposal_id,
              action: status,
              reviewer_id: reviewerId,
              state: choosenRole,
              response_time: lastLog
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

          const updateNotif = UpdatePaymentNotifMapper(
            payment,
            logs,
            action,
            choosenRole,
          );
          if (
            updateNotif.createManyWebNotifPayload &&
            updateNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.log(
              'log',
              `Creating new notification with payload of \n${updateNotif.createManyWebNotifPayload}`,
            );
            prisma.notification.createMany({
              data: updateNotif.createManyWebNotifPayload,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `Creating file manager with payload of \n${fileManagerCreateManyPayload}`,
            );
            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          return {
            payment,
            cheque,
            logs,
            updateNotif,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'createManyPayment error details: ',
        'updating payment status!',
      );
      throw theError;
    }
  }

  async completePayment(currentUser: TenderCurrentUser, proposal_id: string) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `updating proposal ${proposal_id} status to DONE_BY_CASHIER`,
          );

          const updatedProposal = await prisma.proposal.update({
            where: { id: proposal_id },
            data: {
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              inner_status: InnerStatusEnum.DONE_BY_CASHIER,
            },
          });

          const lastLog = await prisma.proposal_log.findFirst({
            where: { proposal_id },
            select: {
              created_at: true,
            },
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          });

          this.logger.log('info', `Creating Proposal Log`);
          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: 'complete_payment',
              reviewer_id: currentUser.id,
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              user_role: TenderAppRoleEnum.CASHIER,
              response_time: lastLog
                ? Math.round(
                    (new Date().getTime() - lastLog.created_at.getTime()) /
                      60000,
                  )
                : null,
            },
          });

          return updatedProposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'complete payment error details: ',
        'compliting payment!',
      );
      throw theError;
    }
  }

  async sendClosingReport(
    currentUser: TenderCurrentUser,
    proposal_id: string,
    send: boolean,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.log(
            'info',
            `updating proposal ${proposal_id} status to ${
              send ? 'REQUESTING_CLOSING_FORM' : 'COMPLETE'
            } `,
          );

          let proposalUpdateInput: Prisma.proposalUncheckedUpdateInput = {
            state: TenderAppRoleEnum.CLIENT,
            inner_status: send
              ? InnerStatusEnum.REQUESTING_CLOSING_FORM
              : InnerStatusEnum.PROJECT_COMPLETED,
          };

          if (!send) {
            proposalUpdateInput = {
              ...proposalUpdateInput,
              outter_status: OutterStatusEnum.COMPLETED,
            };
          }

          const updatedProposal = await prisma.proposal.update({
            where: { id: proposal_id },
            data: proposalUpdateInput,
          });

          const lastLog = await prisma.proposal_log.findFirst({
            where: { proposal_id },
            select: {
              created_at: true,
            },
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          });

          this.logger.log('info', `Creating Proposal Log`);
          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: send ? 'sending_closing_report' : 'complete',
              reviewer_id: currentUser.id,
              state: send
                ? TenderAppRoleEnum.PROJECT_SUPERVISOR
                : TenderAppRoleEnum.CLIENT,
              user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              response_time: lastLog
                ? Math.round(
                    (new Date().getTime() - lastLog.created_at.getTime()) /
                      60000,
                  )
                : null,
            },
          });

          return updatedProposal;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'complete payment error details: ',
        'compliting payment!',
      );
      throw theError;
    }
  }

  async submitClosingReport(
    proposal_id: string,
    closingReportPayload: Prisma.proposal_closing_reportUncheckedCreateInput,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    uploadedFilePath: string[],
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        this.logger.log(
          'info',
          `updating proposal ${proposal_id}, inner and outter to be completed`,
        );
        await prisma.proposal.update({
          where: {
            id: proposal_id,
          },
          data: {
            inner_status: InnerStatusEnum.PROJECT_COMPLETED,
            outter_status: OutterStatusEnum.COMPLETED,
          },
        });

        this.logger.log(
          'info',
          `creating closing report with paylaod of \n${logUtil(
            closingReportPayload,
          )}`,
        );
        await prisma.proposal_closing_report.create({
          data: closingReportPayload,
        });

        this.logger.log(
          'info',
          `creating new file manager with paylaod of \n${logUtil(
            fileManagerCreateManyPayload,
          )}`,
        );
        await prisma.file_manager.createMany({
          data: fileManagerCreateManyPayload,
        });

        this.logger.log('info', `creating new proposal log`);
        await prisma.proposal_log.create({
          data: {
            id: nanoid(),
            proposal_id,
            action: 'Project Completed',
            state: TenderAppRoleEnum.CLIENT,
            user_role: TenderAppRoleEnum.CLIENT,
          },
        });

        await prisma.file_manager.createMany({
          data: fileManagerCreateManyPayload,
        });
      });
    } catch (err) {
      if (uploadedFilePath.length > 0) {
        this.logger.log(
          'info',
          `error occured during submitting closing report, deleting all previous uploaded files`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }

      const theError = prismaErrorThrower(
        err,
        TenderProposalPaymentRepository.name,
        'Send Amandement error details: ',
        'Sending Amandement!',
      );
      throw theError;
    }
  }
}
