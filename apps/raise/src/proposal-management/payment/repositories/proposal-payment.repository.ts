import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, cheque, payment } from '@prisma/client';
import { Sql } from '@prisma/client/runtime';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import { logUtil } from '../../../commons/utils/log-util';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import {
  BankDetailsDto,
  FindBankListFilter,
  FindTrackBudgetFilter,
} from '../dtos/requests';
import { ProposalPaymentEntity } from '../entities/proposal-payment.entity';
import { CloseReportNotifMapper } from '../mappers';
import { UpdatePaymentNotifMapper } from '../mappers/update-payment-notif.mapper';

export class CreatePaymentProps {
  id?: string;
  proposal_id: string;
  status?: string;
  order?: string;
  payment_amount?: string;
  payment_date?: Date;
}

export class UpdatePaymentProps {
  id: string;
  proposal_id?: string;
  status?: string | null;
  order?: string;
  payment_amount?: string;
  payment_date?: Date;
}

@Injectable()
export class ProposalPaymentRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(ProposalPaymentRepository.name)
    private logger: PinoLogger,
  ) {}

  paymentRepoErrorMapper(error: any) {
    console.trace(error);
    this.logger.error(`error detail ${JSON.stringify(error)}`);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new PrismaInvalidForeignKeyException(
        error.code,
        error.clientVersion,
        error.meta,
      );
    }

    throw error;
  }

  // refactored with session
  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<ProposalPaymentEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawPayment = await prisma.payment.findUnique({
        where: { id },
      });

      if (!rawPayment) return null;

      const paymentEntity = Builder<ProposalPaymentEntity>(
        ProposalPaymentEntity,
        {
          ...rawPayment,
          payment_amount:
            rawPayment.payment_amount !== null
              ? parseFloat(rawPayment.payment_amount.toString())
              : null,
          number_of_payments:
            rawPayment.number_of_payments !== null
              ? parseFloat(rawPayment.number_of_payments.toString())
              : null,
          order:
            rawPayment.order !== null
              ? parseFloat(rawPayment.order.toString())
              : null,
        },
      ).build();

      return paymentEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // refactored with session
  async create(props: CreatePaymentProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedPayment = await prisma.payment.create({
        data: {
          id: props.id || nanoid(),
          status: props.status,
          order: props.order,
          proposal_id: props.proposal_id,
          payment_amount: props.payment_amount,
          payment_date: props.payment_date,
        },
      });

      const createdPaymentEntity = Builder<ProposalPaymentEntity>(
        ProposalPaymentEntity,
        {
          ...rawCreatedPayment,
          payment_amount:
            rawCreatedPayment.payment_amount !== null
              ? parseFloat(rawCreatedPayment.payment_amount.toString())
              : null,
          number_of_payments:
            rawCreatedPayment.number_of_payments !== null
              ? parseFloat(rawCreatedPayment.number_of_payments.toString())
              : null,
          order:
            rawCreatedPayment.order !== null
              ? parseFloat(rawCreatedPayment.order.toString())
              : null,
        },
      ).build();

      return createdPaymentEntity;
    } catch (error) {
      this.paymentRepoErrorMapper(error);
    }
  }

  // refactored with session
  async createMany(
    props: CreatePaymentProps[],
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedPayment = await prisma.payment.createMany({
        data: props.map((prop) => {
          return {
            id: prop.id || nanoid(),
            status: prop.status,
            order: prop.order,
            proposal_id: prop.proposal_id,
            payment_amount: prop.payment_amount,
            payment_date: prop.payment_date,
          };
        }),
      });

      return rawCreatedPayment.count;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // refactored with session
  async update(props: UpdatePaymentProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedPayment = await prisma.payment.update({
        where: { id: props.id },
        data: {
          id: props.id || nanoid(),
          status: props.status,
          order: props.order,
          proposal_id: props.proposal_id,
          payment_amount: props.payment_amount,
          payment_date: props.payment_date,
        },
      });

      const updatedPaymentEntity = Builder<ProposalPaymentEntity>(
        ProposalPaymentEntity,
        {
          ...rawCreatedPayment,
          payment_amount:
            rawCreatedPayment.payment_amount !== null
              ? parseFloat(rawCreatedPayment.payment_amount.toString())
              : null,
          number_of_payments:
            rawCreatedPayment.number_of_payments !== null
              ? parseFloat(rawCreatedPayment.number_of_payments.toString())
              : null,
          order:
            rawCreatedPayment.order !== null
              ? parseFloat(rawCreatedPayment.order.toString())
              : null,
        },
      ).build();

      return updatedPaymentEntity;
    } catch (error) {
      this.paymentRepoErrorMapper(error);
    }
  }

  async findPaymentById(id: string): Promise<payment | null> {
    this.logger.debug(`finding payment by id of ${id}... `);
    try {
      return await this.prismaService.payment.findUnique({
        where: { id },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
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
        ProposalPaymentRepository.name,
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
          this.logger.info(
            `updating proposal ${proposal_id} with payload of \n ${logUtil(
              proposalUpdatePayload,
            )}`,
          );

          const updatedProposal = await prisma.proposal.update({
            where: { id: proposal_id },
            data: proposalUpdatePayload,
          });

          this.logger.info(`Creating Proposal Log`);
          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: ProposalAction.INSERT_PAYMENT,
              reviewer_id,
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
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

          /* disable for a while  (set payment / insert payment)*/
          // const insertNotif = InsertPaymentNotifMapper(logs);
          // if (
          //   insertNotif.createManyWebNotifPayload &&
          //   insertNotif.createManyWebNotifPayload.length > 0
          // ) {
          //   this.logger.log(
          //     'info',
          //     `Creating new notification with payload of \n${insertNotif.createManyWebNotifPayload}`,
          //   );
          //   prisma.notification.createMany({
          //     data: insertNotif.createManyWebNotifPayload,
          //   });
          // }

          this.logger.info(
            `creating payments with payload of \n${logUtil(
              createManyPaymentPayload,
            )}`,
          );
          await this.prismaService.payment.createMany({
            data: createManyPaymentPayload,
          });

          // return {
          //   insertNotif,
          //   updatedProposal,
          // };
          return {
            proposal: updatedProposal,
            proposal_log: logs,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
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
        ProposalPaymentRepository.name,
        'Finding Payments error details: ',
        'Finding Payments!',
      );
      throw theError;
    }
  }

  async updatePayment(
    paymentId: string,
    status: string | null,
    action:
      | 'accept'
      | 'reject'
      | 'edit'
      | 'upload_receipt'
      | 'issue'
      | 'confirm_payment'
      | 'reject_payment',
    reviewerId: string,
    choosenRole: TenderAppRole,
    chequeCreatePayload: Prisma.chequeUncheckedCreateInput | undefined,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    lastLog: {
      created_at: Date;
    } | null,
    proposalUpdateInput: Prisma.proposalUpdateInput,
    notes?: string,
    deletedFileManagerUrl?: string,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.info(
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
            this.logger.info(
              `creating cheque records with payload of\n${chequeCreatePayload}`,
            );
            cheque = await prisma.cheque.create({
              data: chequeCreatePayload,
            });
          }

          if (Object.keys(proposalUpdateInput).length > 0) {
            this.logger.info(
              `updating proposal with payload of \n${proposalUpdateInput}`,
            );
            await prisma.proposal.update({
              where: {
                id: payment.proposal_id,
              },
              data: proposalUpdateInput,
            });
          }

          this.logger.info(`Creating Proposal Log`);
          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: payment.proposal_id,
              action: status,
              reviewer_id: reviewerId,
              state: choosenRole,
              user_role: choosenRole,
              message: `batch_${payment.order}`,
              response_time: lastLog
                ? Math.round(
                    (new Date().getTime() - lastLog.created_at.getTime()) /
                      60000,
                  )
                : null,
              notes:
                choosenRole === 'PROJECT_MANAGER' && // if it pm
                status === ProposalAction.SET_BY_SUPERVISOR && // if it rejected
                notes // if notes exist
                  ? notes
                  : '',
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
            cheque,
          );

          if (
            updateNotif.createManyWebNotifPayload &&
            updateNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.info(
              `Creating new notification with payload of \n${updateNotif.createManyWebNotifPayload}`,
            );
            await prisma.notification.createMany({
              data: updateNotif.createManyWebNotifPayload,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.info(
              `Creating file manager with payload of \n${fileManagerCreateManyPayload}`,
            );
            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          if (deletedFileManagerUrl && deletedFileManagerUrl !== '') {
            await prisma.file_manager.update({
              where: { url: deletedFileManagerUrl },
              data: { is_deleted: true },
            });
          }
          // throw new BadRequestException('func on debugging');
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
        ProposalPaymentRepository.name,
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
          this.logger.info(
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

          this.logger.info(`Creating Proposal Log`);
          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: ProposalAction.COMPLETE_PAYMENT,
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
        ProposalPaymentRepository.name,
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
          this.logger.info(
            `updating proposal ${proposal_id} status to ${
              send
                ? 'REQUESTING_CLOSING_FORM'
                : ProposalAction.PROJECT_COMPLETED
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

          this.logger.info(`Creating Proposal Log`);
          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: proposal_id,
              action: send
                ? ProposalAction.SENDING_CLOSING_REPORT
                : ProposalAction.PROJECT_COMPLETED,
              reviewer_id: currentUser.id,
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
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

          const closeReportNotif = CloseReportNotifMapper(
            logs,
            proposal_id,
            (this.configService.get('tenderAppConfig.baseUrl') as string) ||
              undefined,
          );
          if (
            closeReportNotif.createManyWebNotifPayload &&
            closeReportNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.info(
              `Creating new notification with payload of \n${closeReportNotif.createManyWebNotifPayload}`,
            );
            await prisma.notification.createMany({
              data: closeReportNotif.createManyWebNotifPayload,
            });
          }

          return {
            updatedProposal,
            closeReportNotif,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
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
        this.logger.info(
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

        this.logger.info(
          `creating closing report with paylaod of \n${logUtil(
            closingReportPayload,
          )}`,
        );
        await prisma.proposal_closing_report.create({
          data: closingReportPayload,
        });

        this.logger.info(
          `creating new file manager with paylaod of \n${logUtil(
            fileManagerCreateManyPayload,
          )}`,
        );
        await prisma.file_manager.createMany({
          data: fileManagerCreateManyPayload,
        });

        this.logger.info(`creating new proposal log`);
        await prisma.proposal_log.create({
          data: {
            id: nanoid(),
            proposal_id,
            action: ProposalAction.PROJECT_COMPLETED,
            state: TenderAppRoleEnum.CLIENT,
            user_role: TenderAppRoleEnum.CLIENT,
          },
        });
      });
    } catch (err) {
      if (uploadedFilePath.length > 0) {
        this.logger.info(
          `error occured during submitting closing report, deleting all previous uploaded files`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }

      const theError = prismaErrorThrower(
        err,
        ProposalPaymentRepository.name,
        'Send Amandement error details: ',
        'Sending Amandement!',
      );
      throw theError;
    }
  }

  async createManyTrackSection(
    createPayload: Prisma.track_sectionCreateManyInput[],
  ) {
    this.logger.debug(
      `Create new track section with payload of \n ${logUtil(createPayload)}`,
    );
    try {
      return await this.prismaService.track_section.createMany({
        data: createPayload,
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'create new track section error details: ',
        'create new track section!',
      );
      throw theError;
    }
  }

  async deleteTrackBudget(id: string) {
    this.logger.debug(
      `Create new track section with payload of \n ${logUtil(id)}`,
    );
    try {
      return await this.prismaService.track_section.update({
        where: {
          id,
        },
        data: { is_deleted: true },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'create new track section error details: ',
        'create new track section!',
      );
      throw theError;
    }
  }

  async updateTrackBudget(id: string, name: string, budget: number) {
    this.logger.debug(`Update track section with payload of \n ${logUtil(id)}`);

    try {
      return await this.prismaService.track_section.update({
        where: { id },
        data: { name, budget },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'update track section error details: ',
        'update track section!',
      );
      throw theError;
    }
  }

  async findTrackBudgets(filter: FindTrackBudgetFilter) {
    try {
      const { limit = 0, page = 1, is_deleted } = filter;
      const offset = (page - 1) * limit;

      let deletedCondition: boolean = false;
      if (is_deleted && is_deleted === '0') deletedCondition = false;
      if (is_deleted && is_deleted === '1') deletedCondition = true;

      let query: Sql = Prisma.sql`
      SELECT
      track.id::text as id,
      track.name as name,
      (
        SELECT
          COALESCE(JSON_AGG(track_section), '[]'::json)
        FROM
          track_section
        WHERE
          track.id = track_section.track_id
          AND track_section.is_deleted = ${deletedCondition}
      ) as sections,
      (
        SELECT
          COALESCE(
            JSON_AGG(
              json_build_object(
                'id', proposal.id::text,
                'project_name', proposal.project_name::text,
                'budget_used',COALESCE(proposal.fsupport_by_supervisor, 0)
              )
            ),
            '[]'::json
          )
        FROM
          proposal
        WHERE
          track.id = proposal.track_id
      ) as used_on,
      COALESCE(
      (
       SELECT
          SUM(COALESCE(proposal.fsupport_by_supervisor, 0))
        FROM
          proposal
        WHERE
          track.id = proposal.track_id
      ),0) AS total_budget_used
      FROM
        track
      LEFT JOIN
        track_section ON track.id = track_section.track_id
      WHERE
        track.is_deleted = ${deletedCondition}
      GROUP BY
      track.id, track.name`;

      if (limit > 0) {
        query = Prisma.sql`${query} LIMIT ${limit} OFFSET ${offset}`;
      }

      const response: any = await this.prismaService.$queryRaw(query);
      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }

  async findTrackBudget(filter: FindTrackBudgetFilter) {
    try {
      const { id } = filter;

      let query: Sql = Prisma.sql`
      SELECT
        track.id::text as id,
        track.name as name,
        (
          SELECT
            COALESCE(JSON_AGG(track_section), '[]'::json)
          FROM
            track_section
          WHERE
            track.id = track_section.track_id
            AND track_section.is_deleted = false
        ) as sections,
        (
          SELECT
            COALESCE(
              JSON_AGG(
                json_build_object(
                  'id', proposal.id::text,
                  'project_name', proposal.project_name::text,
                  'budget_used',COALESCE(proposal.fsupport_by_supervisor, 0)
                )
              ),
              '[]'::json
            )
          FROM
            proposal
          WHERE
            track.id = proposal.track_id
        ) as used_on,
        COALESCE(
        (
         SELECT
            SUM(COALESCE(proposal.fsupport_by_supervisor, 0))
          FROM
            proposal
          WHERE
            track.id = proposal.track_id
        ),0) AS total_budget_used
        FROM
          track
        LEFT JOIN
          track_section ON track.id = track_section.track_id
        WHERE
          track.is_deleted = false
          AND track.id = ${id}
        GROUP BY
        track.id, track.name`;

      const response: any = await this.prismaService.$queryRaw(query);
      if (response.length === 0) return null;
      return response[0];
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'Find Track Budget Error:',
        `finding !`,
      );
      throw theError;
    }
  }

  // Bank list
  async createBankList(createPayload: Prisma.banksCreateInput) {
    this.logger.debug(
      `Create new bank with payload of \n ${logUtil(createPayload)}`,
    );

    try {
      return await this.prismaService.banks.create({
        data: createPayload,
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'create new bank error details: ',
        'create new bank!',
      );
      throw theError;
    }
  }

  async updateBankList(id: string, bank_name: string) {
    this.logger.debug(`Update track section with payload of \n ${logUtil(id)}`);

    try {
      return await this.prismaService.banks.update({
        where: { id },
        data: { bank_name },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'update bank list error details: ',
        'update bank list!',
      );
      throw theError;
    }
  }

  async findBankList(filter: FindBankListFilter) {
    try {
      const { limit = 10, page = 1, sort = 'desc', sorting_field } = filter;
      const offset = (page - 1) * limit;

      let whereClause: Prisma.banksWhereInput = {};

      const order_by: Prisma.banksOrderByWithRelationInput = {};
      const field = sorting_field as keyof Prisma.banksOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      let queryOptions: Prisma.banksFindManyArgs = {
        where: whereClause,
        skip: offset,
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      const data = await this.prismaService.banks.findMany(queryOptions);

      const total = await this.prismaService.banks.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'Find Bank list Error:',
        `Finding Bank List!`,
      );
      throw theError;
    }
  }

  async getBankDetails(request: BankDetailsDto) {
    try {
      const response = await this.prismaService.banks.findFirst({
        where: { id: request.id },
      });

      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'Find Bank details Error:',
        `Finding Bank Details!`,
      );
      throw theError;
    }
  }

  async softDeleteBank(
    id: string,
    userIds: string[],
    userStatusLogPayload: Prisma.user_status_logCreateManyInput[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.banks.update({
            where: { id },
            data: { is_deleted: true },
          });

          if (userIds.length > 0 && userStatusLogPayload.length > 0) {
            await prisma.user.updateMany({
              where: { id: { in: userIds } },
              data: { status_id: { set: 'SUSPENDED_ACCOUNT' } },
            });

            await prisma.user_status_log.createMany({
              data: userStatusLogPayload,
            });
          }
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'Find Bank details Error:',
        `Finding Bank Details!`,
      );
      throw theError;
    }
  }

  async findUserByBankId(id: string) {
    try {
      const response = await this.prismaService.user.findMany({
        where: {
          bank_information: {
            some: {
              bank_id: id,
            },
          },
        },
      });

      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalPaymentRepository.name,
        'Find Bank details Error:',
        `Finding Bank Details!`,
      );
      throw theError;
    }
  }
}
