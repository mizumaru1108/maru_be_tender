import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, proposal_item_budget } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { logUtil } from '../../../commons/utils/log-util';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import {
  TenderAppRoleEnum,
  appRoleMappers,
} from '../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { ProposalItemBudgetEntity } from '../../item-budget/entities/proposal.item.budget.entity';
import { ProposalPaymentEntity } from '../../payment/entities/proposal-payment.entity';
import {
  FetchClosingReportListFilterRequest,
  FetchRejectionListFilterRequest,
  PaymentAdjustmentFilterRequest,
  PreviousProposalFilterRequest,
  RequestInProcessFilterRequest,
} from '../dtos/requests';
import { FetchAmandementFilterRequest } from '../dtos/requests/fetch-amandement-filter-request.dto';
import { FetchProposalFilterRequest } from '../dtos/requests/fetch-proposal-filter-request.dto';
import { FetchProposalByIdResponse } from '../dtos/responses/fetch-proposal-by-id.response.dto';
import { UpdateMyProposalResponseDto } from '../dtos/responses/update-my-proposal-response.dto';
import { ProposalEntity } from '../entities/proposal.entity';
import { NewAmandementNotifMapper } from '../mappers/new-amandement-notif-mapper';
import { SendRevisionNotifMapper } from '../mappers/send-revision-notif-mapper';
import {
  ProposalCreateProps,
  ProposalDeleteProps,
  ProposalFetchByIdProps,
  ProposalFindManyProps,
  ProposalUpdateProps,
} from '../types';
import { PaymentStatusEnum } from 'src/proposal-management/payment/types/enums/payment.status.enum';

@Injectable()
export class ProposalRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(ProposalRepository.name) private logger: PinoLogger,
  ) {}

  async findByIdFilter(
    props: ProposalFetchByIdProps,
  ): Promise<Prisma.proposalFindFirstArgs> {
    const { includes_relation } = props;

    let findByIdFilter: Prisma.proposalFindFirstArgs = {
      where: { id: props.id },
    };

    if (includes_relation && includes_relation.length > 0) {
      let include: Prisma.proposalInclude = {};

      for (const relation of includes_relation) {
        if (relation === 'user') {
          include = {
            ...include,
            user: {
              select: {
                id: true,
                email: true,
                mobile_number: true,
                employee_name: true,
                client_data: true,
                roles: true,
                bank_information: true,
              },
            },
          };
        }

        if (relation === 'beneficiary_details') {
          include = {
            ...include,
            beneficiary_details: true,
          };
        }

        if (relation === 'follow_ups') {
          include = {
            ...include,
            follow_ups: {
              include: {
                user: {
                  include: {
                    roles: true,
                  },
                },
              },
            },
          };
        }

        if (relation === 'track') {
          include = {
            ...include,
            track: true,
          };
        }

        if (relation === 'proposal_item_budgets') {
          include = {
            ...include,
            proposal_item_budgets: true,
          };
        }

        if (relation === 'supervisor') {
          include = {
            ...include,
            supervisor: true,
          };
        }

        if (relation === 'proposal_logs') {
          include = {
            ...include,
            proposal_logs: {
              include: {
                reviewer: true,
              },
            },
          };
        }

        if (relation === 'payments') {
          include = {
            ...include,
            payments: {
              include: {
                cheques: true,
              },
            },
          };
        }

        if (relation === 'bank_information') {
          include = {
            ...include,
            bank_information: true,
          };
        }

        if (relation === 'project_timeline') {
          include = {
            ...include,
            project_timeline: true,
          };
        }
      }

      findByIdFilter.include = include;
    }
    return findByIdFilter;
  }

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async fetchById(
    props: ProposalFetchByIdProps,
    session?: PrismaService,
  ): Promise<ProposalEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const filterQuery = await this.findByIdFilter(props);
      const rawProposal = await prisma.proposal.findFirst(filterQuery);

      if (!rawProposal) return null;

      const tmpProposal = rawProposal as any;
      const proposalByIdEntity = Builder<ProposalEntity>(ProposalEntity, {
        ...rawProposal,
        amount_required_fsupport:
          rawProposal.amount_required_fsupport !== null
            ? parseFloat(rawProposal.amount_required_fsupport.toString())
            : null,
        whole_budget:
          rawProposal.whole_budget !== null
            ? parseFloat(rawProposal.whole_budget.toString())
            : null,
        number_of_payments:
          rawProposal.number_of_payments !== null
            ? parseFloat(rawProposal.number_of_payments.toString())
            : null,
        partial_support_amount:
          rawProposal.partial_support_amount !== null
            ? parseFloat(rawProposal.partial_support_amount.toString())
            : null,
        fsupport_by_supervisor:
          rawProposal.fsupport_by_supervisor !== null
            ? parseFloat(rawProposal.fsupport_by_supervisor.toString())
            : null,
        number_of_payments_by_supervisor:
          rawProposal.number_of_payments_by_supervisor !== null
            ? parseFloat(
                rawProposal.number_of_payments_by_supervisor.toString(),
              )
            : null,
        execution_time:
          rawProposal.execution_time !== null
            ? parseFloat(rawProposal.execution_time.toString())
            : null,
        payments:
          tmpProposal.payments && tmpProposal.payments.length > 0
            ? tmpProposal.payments.map((payment: ProposalPaymentEntity) =>
                Builder<ProposalPaymentEntity>(ProposalPaymentEntity, {
                  payment_amount: !!payment.payment_amount
                    ? parseFloat(payment.payment_amount.toString())
                    : null,
                  order: !!payment.order
                    ? parseInt(payment.order.toString())
                    : null,
                  number_of_payments: !!payment.number_of_payments
                    ? parseInt(payment.number_of_payments.toString())
                    : null,
                }).build(),
              )
            : undefined,
        proposal_item_budgets:
          tmpProposal.proposal_item_budgets &&
          tmpProposal.proposal_item_budgets.length > 0
            ? tmpProposal.proposal_item_budgets.map(
                (rawBudget: ProposalItemBudgetEntity) => {
                  return Builder<ProposalItemBudgetEntity>(
                    ProposalItemBudgetEntity,
                    {
                      ...rawBudget,
                      amount: parseFloat(rawBudget.amount.toString()),
                    },
                  ).build();
                },
              )
            : undefined,
      }).build();

      return proposalByIdEntity;
    } catch (error) {
      throw error;
    }
  }

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async update(
    props: ProposalUpdateProps,
    session?: PrismaService,
  ): Promise<ProposalEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawUpdatedProposal = await prisma.proposal.update({
        where: { id: props.id },
        data: {
          accreditation_type_id: props.accreditation_type_id,
          added_value: props.added_value,
          amount_required_fsupport: props.amount_required_fsupport,
          been_made_before: props.been_made_before,
          been_supported_before: props.been_supported_before,
          beneficiary_id: props.beneficiary_id,
          cashier_id: props.cashier_id,
          chairman_of_board_of_directors: props.chairman_of_board_of_directors,
          clasification_field: props.clasification_field,
          clause: props.clause,
          closing_report: props.closing_report,
          does_an_agreement: props.does_an_agreement,
          execution_time: props.execution_time,
          finance_id: props.finance_id,
          fsupport_by_supervisor: props.fsupport_by_supervisor,
          governorate: props.governorate,
          id: props.id || nanoid(),
          inclu_or_exclu: props.inclu_or_exclu,
          inner_status: props.inner_status,
          letter_ofsupport_req: props.letter_ofsupport_req,
          most_clents_projects: props.most_clents_projects,
          need_consultant: props.need_consultant,
          need_picture: props.need_picture,
          num_ofproject_binicficiaries: props.num_ofproject_binicficiaries,
          number_of_payments: props.number_of_payments,
          number_of_payments_by_supervisor:
            props.number_of_payments_by_supervisor,
          oid: props.oid,
          old_inner_status: props.old_inner_status,
          on_consulting: props.on_consulting,
          on_revision: props.on_revision,
          outter_status: props.outter_status,
          partial_support_amount: props.partial_support_amount,
          pm_email: props.pm_email,
          pm_mobile: props.pm_mobile,
          pm_name: props.pm_name,
          project_attachments: props.project_attachments,
          project_beneficiaries: props.project_beneficiaries,
          project_beneficiaries_specific_type:
            props.project_beneficiaries_specific_type,
          project_goals: props.project_goals,
          project_idea: props.project_idea,
          project_implement_date: props.project_implement_date,
          project_location: props.project_location,
          project_manager_id: props.project_manager_id,
          project_name: props.project_name,
          project_outputs: props.project_outputs,
          project_risks: props.project_risks,
          project_strengths: props.project_strengths,
          project_track: props.project_track,
          proposal_bank_id: props.proposal_bank_id,
          reasons_to_accept: props.reasons_to_accept,
          region: props.region,
          remote_or_insite: props.remote_or_insite,
          state: props.state,
          step: props.step,
          submitter_user_id: props.submitter_user_id,
          supervisor_id: props.supervisor_id,
          support_goal_id: props.support_goal_id,
          support_outputs: props.support_outputs,
          support_type: props.support_type,
          target_group_age: props.target_group_age,
          target_group_num: props.target_group_num,
          target_group_type: props.target_group_type,
          track_id: props.track_id,
          vat: props.vat,
          vat_percentage: props.vat_percentage,
          whole_budget: props.whole_budget,
        },
      });

      const updatedProposalEntity = Builder<ProposalEntity>(ProposalEntity, {
        ...rawUpdatedProposal,
        amount_required_fsupport:
          rawUpdatedProposal.amount_required_fsupport !== null
            ? parseFloat(rawUpdatedProposal.amount_required_fsupport.toString())
            : null,
        whole_budget:
          rawUpdatedProposal.whole_budget !== null
            ? parseFloat(rawUpdatedProposal.whole_budget.toString())
            : null,
        number_of_payments:
          rawUpdatedProposal.number_of_payments !== null
            ? parseFloat(rawUpdatedProposal.number_of_payments.toString())
            : null,
        partial_support_amount:
          rawUpdatedProposal.partial_support_amount !== null
            ? parseFloat(rawUpdatedProposal.partial_support_amount.toString())
            : null,
        fsupport_by_supervisor:
          rawUpdatedProposal.fsupport_by_supervisor !== null
            ? parseFloat(rawUpdatedProposal.fsupport_by_supervisor.toString())
            : null,
        number_of_payments_by_supervisor:
          rawUpdatedProposal.number_of_payments_by_supervisor !== null
            ? parseFloat(
                rawUpdatedProposal.number_of_payments_by_supervisor.toString(),
              )
            : null,
        execution_time:
          rawUpdatedProposal.execution_time !== null
            ? parseFloat(rawUpdatedProposal.execution_time.toString())
            : null,
      }).build();

      return updatedProposalEntity;
    } catch (error) {
      this.logger.error('Error on updating proposal =%j', error);
      throw error;
    }
  }

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async create(
    props: ProposalCreateProps,
    session?: PrismaService,
  ): Promise<ProposalEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedProposal = await prisma.proposal.create({
        data: {
          accreditation_type_id: props.accreditation_type_id,
          added_value: props.added_value,
          amount_required_fsupport: props.amount_required_fsupport,
          been_made_before: props.been_made_before,
          been_supported_before: props.been_supported_before,
          beneficiary_id: props.beneficiary_id,
          cashier_id: props.cashier_id,
          chairman_of_board_of_directors: props.chairman_of_board_of_directors,
          clasification_field: props.clasification_field,
          clause: props.clause,
          closing_report: props.closing_report,
          does_an_agreement: props.does_an_agreement,
          execution_time: props.execution_time,
          finance_id: props.finance_id,
          fsupport_by_supervisor: props.fsupport_by_supervisor,
          governorate: props.governorate,
          id: props.id || nanoid(),
          inclu_or_exclu: props.inclu_or_exclu,
          inner_status: props.inner_status,
          letter_ofsupport_req: props.letter_ofsupport_req,
          most_clents_projects: props.most_clents_projects,
          need_consultant: props.need_consultant,
          need_picture: props.need_picture,
          num_ofproject_binicficiaries: props.num_ofproject_binicficiaries,
          number_of_payments: props.number_of_payments,
          number_of_payments_by_supervisor:
            props.number_of_payments_by_supervisor,
          oid: props.oid,
          old_inner_status: props.old_inner_status,
          on_consulting: props.on_consulting,
          on_revision: props.on_revision,
          outter_status: props.outter_status,
          partial_support_amount: props.partial_support_amount,
          pm_email: props.pm_email,
          pm_mobile: props.pm_mobile,
          pm_name: props.pm_name,
          project_attachments: props.project_attachments,
          project_beneficiaries: props.project_beneficiaries,
          project_beneficiaries_specific_type:
            props.project_beneficiaries_specific_type,
          project_goals: props.project_goals,
          project_idea: props.project_idea,
          project_implement_date: props.project_implement_date,
          project_location: props.project_location,
          project_manager_id: props.project_manager_id,
          project_name: props.project_name,
          project_outputs: props.project_outputs,
          project_risks: props.project_risks,
          project_strengths: props.project_strengths,
          project_track: props.project_track,
          proposal_bank_id: props.proposal_bank_id,
          reasons_to_accept: props.reasons_to_accept,
          region: props.region,
          remote_or_insite: props.remote_or_insite,
          state: props.state,
          step: props.step,
          submitter_user_id: props.submitter_user_id,
          supervisor_id: props.supervisor_id,
          support_goal_id: props.support_goal_id,
          support_outputs: props.support_outputs,
          support_type: props.support_type,
          target_group_age: props.target_group_age,
          target_group_num: props.target_group_num,
          target_group_type: props.target_group_type,
          track_id: props.track_id,
          vat: props.vat,
          vat_percentage: props.vat_percentage,
          whole_budget: props.whole_budget,
        },
      });

      const createdProposalEntity = Builder<ProposalEntity>(ProposalEntity, {
        ...rawCreatedProposal,
        amount_required_fsupport:
          rawCreatedProposal.amount_required_fsupport !== null
            ? parseFloat(rawCreatedProposal.amount_required_fsupport.toString())
            : null,
        whole_budget:
          rawCreatedProposal.whole_budget !== null
            ? parseFloat(rawCreatedProposal.whole_budget.toString())
            : null,
        number_of_payments:
          rawCreatedProposal.number_of_payments !== null
            ? parseFloat(rawCreatedProposal.number_of_payments.toString())
            : null,
        partial_support_amount:
          rawCreatedProposal.partial_support_amount !== null
            ? parseFloat(rawCreatedProposal.partial_support_amount.toString())
            : null,
        fsupport_by_supervisor:
          rawCreatedProposal.fsupport_by_supervisor !== null
            ? parseFloat(rawCreatedProposal.fsupport_by_supervisor.toString())
            : null,
        number_of_payments_by_supervisor:
          rawCreatedProposal.number_of_payments_by_supervisor !== null
            ? parseFloat(
                rawCreatedProposal.number_of_payments_by_supervisor.toString(),
              )
            : null,
        execution_time:
          rawCreatedProposal.execution_time !== null
            ? parseFloat(rawCreatedProposal.execution_time.toString())
            : null,
      }).build();

      return createdProposalEntity;
    } catch (error) {
      this.logger.error('Error on updating proposal =%j', error);
      throw error;
    }
  }

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async delete(props: ProposalDeleteProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawDeleteRes = await prisma.proposal.delete({
        where: { id: props.id },
      });

      const deletedProposalEntity = Builder<ProposalEntity>(ProposalEntity, {
        ...rawDeleteRes,
        amount_required_fsupport:
          rawDeleteRes.amount_required_fsupport !== null
            ? parseFloat(rawDeleteRes.amount_required_fsupport.toString())
            : null,
        whole_budget:
          rawDeleteRes.whole_budget !== null
            ? parseFloat(rawDeleteRes.whole_budget.toString())
            : null,
        number_of_payments:
          rawDeleteRes.number_of_payments !== null
            ? parseFloat(rawDeleteRes.number_of_payments.toString())
            : null,
        partial_support_amount:
          rawDeleteRes.partial_support_amount !== null
            ? parseFloat(rawDeleteRes.partial_support_amount.toString())
            : null,
        fsupport_by_supervisor:
          rawDeleteRes.fsupport_by_supervisor !== null
            ? parseFloat(rawDeleteRes.fsupport_by_supervisor.toString())
            : null,
        number_of_payments_by_supervisor:
          rawDeleteRes.number_of_payments_by_supervisor !== null
            ? parseFloat(
                rawDeleteRes.number_of_payments_by_supervisor.toString(),
              )
            : null,
        execution_time:
          rawDeleteRes.execution_time !== null
            ? parseFloat(rawDeleteRes.execution_time.toString())
            : null,
      }).build();

      return deletedProposalEntity;
    } catch (error) {
      this.logger.info(`Delete Proposal Error details ${error}`);
      if (error.code !== undefined && error.code === 'P2025') {
        throw new DataNotFoundException(
          `Code ${error.code}${
            error.meta.cause ? `, ${error.meta.cause}` : ''
          }`,
        );
      }
      throw error;
    }
  }

  async findMany(props: ProposalFindManyProps, session?: PrismaService) {
    const prisma = session || this.prismaService;
    try {
    } catch (error) {}
  }

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
        ProposalRepository.name,
        'fetchProposalById error details: ',
        'finding proposal!',
      );
      throw theError;
    }
  }

  async createProposal(
    createProposalPayload: Prisma.proposalUncheckedCreateInput,
    proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined,
    proposalTimelinesPayloads: Prisma.project_timelineCreateManyInput[] = [],
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    uploadedFilePath: string[],
  ) {
    this.logger.info(
      `Creating proposal with payload: \n ${logUtil(createProposalPayload)}`,
    );
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.info('creating proposal...');
          const proposal = await prisma.proposal.create({
            data: {
              ...createProposalPayload,
            },
          });

          if (proposal_item_budgets) {
            this.logger.info(
              `Creating item budget with payload: \n ${logUtil(
                proposal_item_budgets,
              )}`,
            );
            await prisma.proposal_item_budget.createMany({
              data: proposal_item_budgets,
            });
          }

          if (
            proposalTimelinesPayloads &&
            proposalTimelinesPayloads.length > 0
          ) {
            this.logger.info(
              `Creating timeline with payload: \n ${logUtil(
                proposalTimelinesPayloads,
              )}`,
            );

            await prisma.project_timeline.createMany({
              data: proposalTimelinesPayloads,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.info(
              `Creating file manager history with payload: \n ${logUtil(
                fileManagerCreateManyPayload,
              )}`,
            );

            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          this.logger.info(`Creating proposal log`);
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
      this.logger.error(`error on prisma occured deleting all uploaded files`);
      if (uploadedFilePath && uploadedFilePath.length > 0) {
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
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
    proposalTimelinePayloads: Prisma.project_timelineCreateManyInput[] = [],
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    deletedFileManagerUrls: string[],
    uploadedFilePath: string[],
    createLog: boolean,
    redirectUrl: string,
  ): Promise<UpdateMyProposalResponseDto> {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.info(
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
            this.logger.info('info', `deleteing previous item budget`);
            await prisma.proposal_item_budget.deleteMany({
              where: {
                proposal_id: proposal.id,
              },
            });

            this.logger.info(
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
            this.logger.info(
              `Creating file manager history with payload: \n ${logUtil(
                fileManagerCreateManyPayload,
              )}`,
            );

            await prisma.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
            this.logger.info(
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

          // save draft not a revision
          if (proposalTimelinePayloads && proposalTimelinePayloads.length > 0) {
            this.logger.info(
              `deleting all timeline on proposal ${proposal.id}`,
            );

            await prisma.project_timeline.deleteMany({
              where: { proposal_id: proposal.id },
            });

            this.logger.info(
              `creating new timeline on proposal ${proposal.id}`,
            );

            await prisma.project_timeline.createMany({
              data: proposalTimelinePayloads,
            });
          }

          // send
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

            const sendRevisionNotif = SendRevisionNotifMapper(
              proposal.id,
              {
                ...createdLog,
                reviewer: createdLog.proposal.supervisor,
              },
              redirectUrl || '',
            );

            if (
              sendRevisionNotif.createManyWebNotifPayload &&
              sendRevisionNotif.createManyWebNotifPayload.length > 0
            ) {
              this.logger.info(
                `Creating new notification for revision sent, with payload of \n${sendRevisionNotif.createManyWebNotifPayload}`,
              );
              await prisma.notification.createMany({
                data: sendRevisionNotif.createManyWebNotifPayload,
              });
            }

            this.logger.info(
              `deleting proposal edit request for proposal ${proposal_id}`,
            );

            // deleting the edit request history
            // await prisma.proposal_edit_request.deleteMany({
            //   where: { proposal_id },
            // });
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
      this.logger.error(
        'saving data on db failed, deleting all uploaded files for this proposal',
      );
      if (uploadedFilePath.length > 0) {
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
        'Asking for supervisor amandement error details: ',
        'Asking for supervisor amandement!',
      );
      throw theError;
    }
  }

  async deleteProposal(proposal_id: string, deletedFileManagerUrls: string[]) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
          this.logger.error(
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

        this.logger.info(`deleting proposal ${proposal_id}`);
        const deletedProposal = await prisma.proposal.delete({
          where: { id: proposal_id },
        });

        return deletedProposal;
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
        'Deleting Draft Proposal error details: ',
        'Deleting Draft Proposal!',
      );
      throw theError;
    }
  }

  async askForAmandementRequest(
    currentUser: TenderCurrentUser,
    id: string,
    createAskEditRequestPayload: Prisma.proposal_asked_edit_requestUncheckedCreateInput,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.info(
            `Updating proposal ${id}, with payload of\n${logUtil(
              proposalUpdatePayload,
            )}`,
          );
          const updatedProposal = await prisma.proposal.update({
            where: { id },
            data: proposalUpdatePayload,
          });

          this.logger.info(
            `Creating new proposal asked edit request with payload of \n${logUtil(
              createAskEditRequestPayload,
            )}`,
          );

          await prisma.proposal_asked_edit_request.create({
            data: createAskEditRequestPayload,
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

          await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: id,
              user_role: appRoleMappers[currentUser.choosenRole],
              reviewer_id: currentUser.id,
              action: ProposalAction.ASK_FOR_AMANDEMENT_REQUEST, //ask to supervisor for amandement request
              state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              notes: createAskEditRequestPayload.notes,
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

          return {
            updatedProposal,
          };
        },
        { maxWait: 500000, timeout: 1500000 },
      );
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'Saving Draft Proposal error details: ',
        'Saving Proposal Draft!',
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
    selectLang?: 'ar' | 'en',
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          this.logger.info(
            `Updating proposal ${id}, with payload of\n${logUtil(
              proposalUpdatePayload,
            )}`,
          );
          const updatedProposal = await prisma.proposal.update({
            where: { id },
            data: proposalUpdatePayload,
          });

          this.logger.info(
            `Creating new proposal edit request with payload of \n${logUtil(
              createProposalEditRequestPayload,
            )}`,
          );

          this.logger.info(
            `Find existing edit request by proposal id of ${id}`,
          );
          const oldData = await prisma.proposal_edit_request.findFirst({
            where: { proposal_id: id },
          });
          if (oldData) {
            this.logger.info(
              `deleting old proposal edit request with porposal id of ${id}`,
            );
            await prisma.proposal_edit_request.delete({
              where: { proposal_id: id },
            });
          }

          this.logger.info(
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

          const sendAmandementNotif = NewAmandementNotifMapper(
            id,
            createdLog,
            this.configService.get('tenderAppConfig.baseUrl') as string,
            selectLang,
          );
          if (
            sendAmandementNotif.createManyWebNotifPayload &&
            sendAmandementNotif.createManyWebNotifPayload.length > 0
          ) {
            this.logger.info(
              `Creating new notification with payload of \n${logUtil(
                sendAmandementNotif.createManyWebNotifPayload,
              )}`,
            );
            await prisma.notification.createMany({
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
        ProposalRepository.name,
        'Send Amandement error details: ',
        'Sending Amandement!',
      );
      throw theError;
    }
  }

  async findAmandementByProposalId(proposal_id: string): Promise<any> {
    try {
      this.logger.info(
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
              proposal_item_budgets: true,
              project_timeline: true,
              beneficiary_id: true,
            },
          },
        },
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
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
      this.logger.info(`Finding amandement with proposal id of ${proposalId}`);
      const raw = await this.prismaService.$queryRaw<
        { detail: string }[]
      >`SELECT detail FROM proposal_edit_request WHERE proposal_id = ${proposalId}`;
      return raw[0] || null;
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
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

      let whereClause: Prisma.proposal_edit_requestWhereInput = {
        proposal: {
          outter_status: { in: [OutterStatusEnum.ON_REVISION] },
        },
      };

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
          // proposal: {
          //   select: { project_number: true, id: true, project_name: true },
          // },
          proposal: true,
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
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchProposalList(
    currentUser: TenderCurrentUser,
    filter: FetchProposalFilterRequest,
  ) {
    try {
      const {
        project_track,
        employee_name,
        project_name,
        outter_status,
        project_number,
        page = 1,
        limit = 10,
        sort,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {};
      let outterClauses: Prisma.proposalWhereInput = {};

      const orClauses: Prisma.proposalWhereInput[] = [];

      /* filter whereClause based on existing permissions on hasura */
      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          submitter_user_id: currentUser.id,
        };
      } else {
        whereClause = {
          ...whereClause,
          step: 'ZERO',
        };

        if (
          [
            'tender_project_supervisor',
            'tender_project_manager',
            'tender_cashier',
            'tender_finance',
          ].indexOf(currentUser.choosenRole) > -1
        ) {
          const reviewer = await this.prismaService.user.findUnique({
            where: {
              id: currentUser.id,
            },
          });
          if (!reviewer || !reviewer.employee_path) {
            throw new BadRequestException('cant find track of this user');
          }

          if (reviewer.employee_path !== 'GENERAL') {
            whereClause = {
              ...whereClause,
              // project_track: reviewer.employee_path,
              OR: [
                { project_track: reviewer.employee_path },
                { project_track: null },
              ],
            };
          }
        }

        if (currentUser.choosenRole === 'tender_project_supervisor') {
          whereClause = {
            ...whereClause,
            OR: [{ supervisor_id: currentUser.id }, { supervisor_id: null }],
          };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = {
            ...whereClause,
            OR: [{ cashier_id: currentUser.id }, { cashier_id: null }],
          };
        }

        if (currentUser.choosenRole === 'tender_finance') {
          whereClause = {
            ...whereClause,
            OR: [{ finance_id: currentUser.id }, { finance_id: null }],
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = {
            ...whereClause,
            OR: [
              { project_manager_id: currentUser.id },
              { project_manager_id: null },
            ],
          };
        }

        if (currentUser.choosenRole === 'tender_ceo') {
          whereClause = {
            ...whereClause,
            // OR: [
            //   { outter_status: OutterStatusEnum.CANCELED },
            // {
            inner_status: {
              in: [
                InnerStatusEnum.ACCEPTED_BY_CONSULTANT,
                InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
              ],
            },
            //   },
            // ],
          };
        }

        if (currentUser.choosenRole === 'tender_consultant') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT,
          };
        }
      }

      if (employee_name) {
        orClauses.push({
          user: {
            client_data: {
              entity: {
                contains: decodeURIComponent(employee_name),
                mode: 'insensitive',
              },
            },
          },
        });
      }

      if (project_name) {
        orClauses.push({
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        });
      }

      if (project_track) {
        orClauses.push({
          project_track: {
            in: project_track,
            mode: 'insensitive',
          },
        });
      }

      if (outter_status) {
        outterClauses = {
          outter_status: {
            in: outter_status,
            mode: 'insensitive',
          },
        };
      }

      // commented for a while untill merge data between staging ad prod done
      // if (project_number) {
      //   orClauses.push({
      //     project_number: {
      //       contains: project_number.toString(),
      //       mode: 'insensitive',
      //     },
      //   });
      // }

      // console.log(logUtil(orClauses));
      // console.log(logUtil(whereClause));

      const data = await this.prismaService.proposal.findMany({
        where: {
          AND: [whereClause, { OR: [...orClauses] }, outterClauses],
        },
        take: limit,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: {
          project_name: sort,
        },
      });

      const total = await this.prismaService.proposal.count({
        where: {
          AND: [whereClause, { OR: [...orClauses] }, outterClauses],
        },
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchOldProposalList(
    currentUser: TenderCurrentUser,
    filter: FetchProposalFilterRequest,
  ) {
    try {
      const {
        project_track,
        employee_name,
        project_name,
        outter_status,
        page = 1,
        limit = 10,
        sort,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        // oid: {
        //   not: null,
        // },
      };

      const andClauses: Prisma.proposalWhereInput[] = [];
      const orClauses: Prisma.proposalWhereInput[] = [];

      /* filter whereClause based on existing permissions on hasura */
      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          submitter_user_id: currentUser.id,
        };
      } else {
        whereClause = {
          ...whereClause,
          step: 'ZERO',
        };
      }

      if (employee_name) {
        orClauses.push({
          user: {
            employee_name: {
              contains: employee_name,
              mode: 'insensitive',
            },
          },
        });
      }

      if (project_name) {
        orClauses.push({
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        });
      }

      if (project_track) {
        // orClauses.push({
        //   project_track: {
        //     in: project_track,
        //     mode: 'insensitive',
        //   },
        // });
        andClauses.push({
          project_track: {
            in: project_track,
            mode: 'insensitive',
          },
        });
      }

      if (outter_status) {
        // outterStatusClauses = {
        //   outter_status: {
        //     in: outter_status,
        //     mode: 'insensitive',
        //   },
        // };
        andClauses.push({
          outter_status: {
            in: outter_status,
            mode: 'insensitive',
          },
        });
      }

      // console.log(logUtil(orClauses));

      const data = await this.prismaService.proposal.findMany({
        where: {
          AND: [whereClause, { OR: [...orClauses] }, ...andClauses],
        },
        take: limit,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: {
          project_name: sort,
        },
      });

      const total = await this.prismaService.proposal.count({
        where: {
          AND: [whereClause, { OR: [...orClauses] }, ...andClauses],
        },
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchRequestInProcess(
    currentUser: TenderCurrentUser,
    filter: RequestInProcessFilterRequest,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        sorting_field,
        type = 'incoming',
        vat,
        track_id,
        project_name,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      if (vat !== undefined) {
        if (vat) {
          whereClause = {
            ...whereClause,
            vat: true,
          };
        } else {
          whereClause = {
            ...whereClause,
            vat: false,
          };
        }
      }

      if (project_name) {
        whereClause = {
          ...whereClause,
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        };
      }

      const order_by: Prisma.proposalOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      /* filter whereClause based on existing permissions on hasura */
      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          submitter_user_id: currentUser.id,
          step: 'ZERO',
        };
      } else {
        whereClause = {
          ...whereClause,
          step: 'ZERO',
        };

        if (
          ['tender_cashier', 'tender_finance'].indexOf(
            currentUser.choosenRole,
          ) === -1
        ) {
          whereClause = {
            ...whereClause,
            state: appRoleMappers[currentUser.choosenRole],
          };
        }

        if (
          [
            'tender_project_supervisor',
            'tender_project_manager',
            'tender_cashier',
            'tender_finance',
            'tender_consultant',
          ].indexOf(currentUser.choosenRole) > -1
        ) {
          const reviewer = await this.prismaService.user.findUnique({
            where: { id: currentUser.id },
            include: { track: true },
          });
          if (!reviewer || !reviewer.track) {
            throw new BadRequestException('cant find track of this user');
          }

          if (reviewer.track.name !== 'GENERAL') {
            whereClause = {
              ...whereClause,
              track_id: reviewer.track.id,
            };
          }
        } else {
          if (track_id) {
            whereClause = {
              ...whereClause,
              track_id,
            };
          }
        }

        if (currentUser.choosenRole === 'tender_moderator') {
          whereClause = {
            ...whereClause,
            inner_status: {
              notIn: [InnerStatusEnum.REJECTED_BY_MODERATOR],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_project_supervisor') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.ACCEPTED_BY_MODERATOR,
            outter_status: {
              notIn: [OutterStatusEnum.ON_REVISION],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = {
            ...whereClause,
            OR: [
              { cashier_id: currentUser.id },
              { cashier_id: null },
              {
                payments: {
                  some: {
                    status: {
                      in: [
                        PaymentStatusEnum.REJECT_CHEQUE,
                        PaymentStatusEnum.ACCEPTED_BY_FINANCE,
                      ],
                    },
                  },
                },
              },
              {
                payments: {
                  every: {
                    status: {
                      in: [PaymentStatusEnum.DONE],
                    },
                  },
                },
              },
            ],
            finance_id: { not: null },
            inner_status:
              InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
          };
        }

        if (currentUser.choosenRole === 'tender_finance') {
          whereClause = {
            ...whereClause,
            payments: {
              some: {
                status: {
                  in: [
                    PaymentStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
                    PaymentStatusEnum.UPLOADED_BY_CASHIER,
                  ],
                },
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
          };
        }

        if (currentUser.choosenRole === 'tender_ceo') {
          whereClause = {
            ...whereClause,
            inner_status: {
              in: [
                InnerStatusEnum.ACCEPTED_BY_CONSULTANT,
                InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
              ],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_consultant') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT,
          };
        }
      }

      if (type === 'incoming') {
        if (currentUser.choosenRole === 'tender_project_supervisor') {
          whereClause = {
            ...whereClause,
            OR: [{ supervisor_id: null }, { supervisor_id: currentUser.id }],
            support_outputs: null,
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = { ...whereClause, project_manager_id: null };
        }
      } else {
        if (currentUser.choosenRole === 'tender_project_supervisor') {
          whereClause = {
            ...whereClause,
            supervisor_id: currentUser.id,
            support_outputs: { not: null },
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = { ...whereClause, project_manager_id: currentUser.id };
        }
      }

      let queryOptions: Prisma.proposalFindManyArgs = {
        where: whereClause,
        skip: offset,
        include: {
          user: true,
          payments: true,
        },
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      console.log(logUtil(whereClause));
      console.log(logUtil(queryOptions));
      const data = await this.prismaService.proposal.findMany(queryOptions);

      const total = await this.prismaService.proposal.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async getPreviousProposal(
    currentUser: TenderCurrentUser,
    filter: PreviousProposalFilterRequest,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        sorting_field,
        outter_status,
        project_name,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      if (project_name) {
        whereClause = {
          ...whereClause,
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        };
      }

      const order_by: Prisma.proposalOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      /* filter whereClause based on existing permissions on hasura */
      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          submitter_user_id: currentUser.id,
          step: 'ZERO',
        };

        if (outter_status) {
          whereClause = {
            ...whereClause,
            outter_status: { in: outter_status },
          };
        }
      } else {
        whereClause = {
          ...whereClause,
          step: 'ZERO',
        };

        if (
          [
            'tender_project_supervisor',
            'tender_project_manager',
            'tender_cashier',
            'tender_finance',
          ].indexOf(currentUser.choosenRole) > -1
        ) {
          const reviewer = await this.prismaService.user.findUnique({
            where: { id: currentUser.id },
            include: { track: true },
          });
          if (!reviewer || !reviewer.track) {
            throw new BadRequestException('cant find track of this user');
          }

          if (reviewer.track.name !== 'GENERAL') {
            whereClause = {
              ...whereClause,
              OR: [{ track_id: reviewer.track.id }, { track_id: null }],
            };
          }
        }

        if (currentUser.choosenRole === 'tender_moderator') {
          whereClause = {
            ...whereClause,
            inner_status: { notIn: [InnerStatusEnum.CREATED_BY_CLIENT] },
          };
        }

        if (currentUser.choosenRole === 'tender_project_supervisor') {
          whereClause = {
            ...whereClause,
            supervisor_id: currentUser.id,
            inner_status: {
              notIn: [
                InnerStatusEnum.CREATED_BY_CLIENT,
                InnerStatusEnum.ACCEPTED_BY_MODERATOR,
              ],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = {
            ...whereClause,
            OR: [{ cashier_id: currentUser.id }, { cashier_id: null }],
            inner_status: {
              in: [
                InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
                InnerStatusEnum.DONE_BY_CASHIER,
                InnerStatusEnum.PROJECT_COMPLETED,
                InnerStatusEnum.REQUESTING_CLOSING_FORM,
              ],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_finance') {
          whereClause = {
            ...whereClause,
            OR: [{ finance_id: currentUser.id }, { finance_id: null }],
            payments: {
              some: {
                status: {
                  in: [ProposalAction.ACCEPTED_BY_FINANCE, ProposalAction.DONE],
                },
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = {
            ...whereClause,
            project_manager_id: currentUser.id,
            inner_status: {
              notIn: [
                InnerStatusEnum.CREATED_BY_CLIENT,
                InnerStatusEnum.ACCEPTED_BY_MODERATOR,
                InnerStatusEnum.REJECTED_BY_MODERATOR,
              ],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_ceo') {
          whereClause = {
            ...whereClause,
            inner_status: {
              notIn: [
                InnerStatusEnum.CREATED_BY_CLIENT,
                InnerStatusEnum.ACCEPTED_BY_MODERATOR,
                InnerStatusEnum.REJECTED_BY_MODERATOR,
              ],
            },
          };
        }

        if (currentUser.choosenRole === 'tender_consultant') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT,
          };
        }
      }

      let queryOptions: Prisma.proposalFindManyArgs = {
        where: whereClause,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      // console.log(logUtil(whereClause));
      // console.log(logUtil(queryOptions));
      const data = await this.prismaService.proposal.findMany(queryOptions);

      const total = await this.prismaService.proposal.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchRejectionList(
    currentUser: TenderCurrentUser,
    filter: FetchRejectionListFilterRequest,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        sorting_field,
        track_id,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      const order_by: Prisma.proposalOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      whereClause = {
        ...whereClause,
        step: 'ZERO',
      };

      if (['tender_project_manager'].indexOf(currentUser.choosenRole) > -1) {
        const reviewer = await this.prismaService.user.findUnique({
          where: { id: currentUser.id },
          include: { track: true },
        });
        if (!reviewer || !reviewer.track) {
          throw new BadRequestException('cant find track of this user');
        }

        if (reviewer.track.name !== 'GENERAL') {
          whereClause = {
            ...whereClause,
            track_id: reviewer.track.id,
          };
        }
      } else {
        if (track_id) {
          whereClause = {
            ...whereClause,
            track_id,
          };
        }
      }

      if (currentUser.choosenRole === 'tender_project_manager') {
        whereClause = {
          ...whereClause,
          // project_manager_id: currentUser.id,
          inner_status: {
            in: [
              InnerStatusEnum.REJECTED_BY_SUPERVISOR,
              InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER,
            ],
          },
        };
      }

      if (currentUser.choosenRole === 'tender_ceo') {
        whereClause = {
          ...whereClause,
          supervisor_id: { not: null },
          inner_status: {
            in: [
              InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER,
              InnerStatusEnum.REJECTED_BY_CEO,
              InnerStatusEnum.REJECTED_BY_CONSULTANT,
            ],
          },
        };
      }

      let queryOptions: Prisma.proposalFindManyArgs = {
        where: whereClause,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      console.log(logUtil(whereClause));
      console.log({ queryOptions });
      const data = await this.prismaService.proposal.findMany(queryOptions);

      const total = await this.prismaService.proposal.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchClosingReportList(
    currentUser: TenderCurrentUser,
    filter: FetchClosingReportListFilterRequest,
  ) {
    try {
      const { page = 1, limit = 10, sort = 'desc', sorting_field } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      const order_by: Prisma.proposalOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      whereClause = {
        ...whereClause,
        step: 'ZERO',
      };

      if (['tender_project_supervisor'].indexOf(currentUser.choosenRole) > -1) {
        const reviewer = await this.prismaService.user.findUnique({
          where: { id: currentUser.id },
          include: { track: true },
        });
        if (!reviewer || !reviewer.track) {
          throw new BadRequestException('cant find track of this user');
        }

        if (reviewer.track.name !== 'GENERAL') {
          whereClause = {
            ...whereClause,
            track_id: reviewer.track.id,
          };
        }
      }

      if (currentUser.choosenRole === 'tender_project_supervisor') {
        whereClause = {
          ...whereClause,
          supervisor_id: currentUser.id,
          inner_status: { in: [InnerStatusEnum.DONE_BY_CASHIER] },
        };
      }

      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          submitter_user_id: currentUser.id,
          inner_status: { in: [InnerStatusEnum.REQUESTING_CLOSING_FORM] },
        };
      }

      let queryOptions: Prisma.proposalFindManyArgs = {
        where: whereClause,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      console.log(logUtil(whereClause));
      console.log({ queryOptions });
      const data = await this.prismaService.proposal.findMany(queryOptions);

      const total = await this.prismaService.proposal.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchPaymentAdjustment(
    currentUser: TenderCurrentUser,
    filter: PaymentAdjustmentFilterRequest,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        sorting_field,
        type = 'incoming',
        project_name,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      if (project_name) {
        whereClause = {
          ...whereClause,
          project_name: {
            contains: project_name,
            mode: 'insensitive',
          },
        };
      }

      const order_by: Prisma.proposalOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      /* filter whereClause based on existing permissions on hasura */

      whereClause = {
        ...whereClause,
        step: 'ZERO',
      };

      if (
        [
          'tender_project_supervisor',
          'tender_project_manager',
          'tender_cashier',
          'tender_finance',
        ].indexOf(currentUser.choosenRole) > -1
      ) {
        const reviewer = await this.prismaService.user.findUnique({
          where: { id: currentUser.id },
          include: { track: true },
        });
        if (!reviewer || !reviewer.track) {
          throw new BadRequestException('cant find track of this user');
        }

        if (reviewer.track.name !== 'GENERAL') {
          whereClause = {
            ...whereClause,
            // OR: [{ track_id: reviewer.track.id }, { track_id: null }],
            track_id: reviewer.track.id,
          };
        }
      }

      if (currentUser.choosenRole === 'tender_project_supervisor') {
        whereClause = {
          ...whereClause,
          supervisor_id: currentUser.id,
          OR: [
            {
              inner_status:
                InnerStatusEnum.ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION,
            },
            {
              payments: {
                some: {
                  status: {
                    in: [
                      PaymentStatusEnum.SET_BY_SUPERVISOR,
                      PaymentStatusEnum.REJECTED_BY_PROJECT_MANAGER,
                    ],
                  },
                },
              },
            },
          ],
        };
      }

      if (currentUser.choosenRole === 'tender_project_manager') {
        whereClause = {
          ...whereClause,
          project_manager_id: currentUser.id,
          AND: [
            {
              payments: {
                some: {
                  status: {
                    equals: PaymentStatusEnum.ISSUED_BY_SUPERVISOR,
                  },
                },
              },
            },
            {
              payments: {
                every: {
                  status: {
                    not: PaymentStatusEnum.REJECTED_BY_PROJECT_MANAGER,
                  },
                },
              },
            },
          ],
        };
      }

      if (currentUser.choosenRole === 'tender_finance') {
        whereClause = {
          ...whereClause,
          OR: [{ finance_id: currentUser.id }, { finance_id: null }],
          payments: {
            some: {
              status: { in: [PaymentStatusEnum.ACCEPTED_BY_PROJECT_MANAGER] },
            },
          },
        };
      }

      if (currentUser.choosenRole === 'tender_cashier') {
        whereClause = {
          ...whereClause,
          OR: [
            { cashier_id: currentUser.id },
            { cashier_id: null },
            {
              payments: {
                some: {
                  status: {
                    in: [
                      PaymentStatusEnum.REJECT_CHEQUE,
                      PaymentStatusEnum.ACCEPTED_BY_FINANCE,
                    ],
                  },
                },
              },
            },
            {
              payments: {
                every: {
                  status: {
                    in: [PaymentStatusEnum.DONE],
                  },
                },
              },
            },
          ],
          inner_status:
            InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
        };
      }

      if (type === 'incoming') {
        if (currentUser.choosenRole === 'tender_finance') {
          whereClause = { ...whereClause, finance_id: null };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = { ...whereClause, cashier_id: null };
        }
      } else {
        if (currentUser.choosenRole === 'tender_finance') {
          whereClause = { ...whereClause, finance_id: currentUser.id };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = { ...whereClause, cashier_id: currentUser.id };
        }
      }

      let queryOptions: Prisma.proposalFindManyArgs = {
        where: whereClause,
        skip: offset,
        include: {
          user: true,
        },
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      // console.log(logUtil(queryOptions));

      const data = await this.prismaService.proposal.findMany(queryOptions);

      const total = await this.prismaService.proposal.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchAmandementRequestList(
    currentUser: TenderCurrentUser,
    filter: FetchAmandementFilterRequest,
  ) {
    try {
      const { project_name, employee_name, page = 1, limit = 10 } = filter;
      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposal_asked_edit_requestWhereInput = {};

      if (employee_name) {
        whereClause = {
          ...whereClause,
          sender: {
            employee_name: {
              contains: employee_name,
              mode: 'insensitive',
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

      const data =
        await this.prismaService.proposal_asked_edit_request.findMany({
          where: whereClause,
          select: {
            id: true,
            notes: true,
            sender_role: true,
            sender: {
              select: {
                employee_name: true,
                mobile_number: true,
                email: true,
              },
            },
            supervisor: {
              select: {
                employee_name: true,
                mobile_number: true,
                email: true,
              },
            },
            proposal: {
              select: {
                id: true,
                project_name: true,
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: {
            created_at: 'desc',
          },
        });

      const total = await this.prismaService.proposal_asked_edit_request.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        ProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }

  async fetchProposalById(
    proposalId: string,
  ): Promise<FetchProposalByIdResponse['response']> {
    try {
      this.logger.info(`fetching proposal ${proposalId}`);
      const proposal = await this.prismaService.proposal.findFirst({
        where: {
          id: proposalId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              mobile_number: true,
              employee_name: true,
              client_data: true,
              roles: true,
              bank_information: true,
            },
          },
          beneficiary_details: true,
          follow_ups: {
            include: {
              user: {
                include: {
                  roles: true,
                },
              },
            },
          },
          track: true,
          proposal_item_budgets: true,
          proposal_logs: {
            include: {
              reviewer: true,
            },
          },
          payments: {
            include: {
              cheques: true,
            },
          },
          bank_information: true,
          project_timeline: true,
        },
      });
      return proposal;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
        'Change state error details: ',
        'Changing proposal state!',
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
        ProposalRepository.name,
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
          // this.logger.log(
          //   'info',
          //   `updating proposal ${proposalId}, with payload of \n${logUtil(
          //     proposalUpdatePayload,
          //   )}`,
          // );
          const proposal = await prismaTrans.proposal.update({
            where: {
              id: proposalId,
            },
            data: proposalUpdatePayload,
          });

          this.logger.info(
            `creating proposal log, with payload of \n${logUtil(
              proposalLogCreateInput,
            )}`,
          );
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
            // this.logger.log(
            //   'info',
            //   `creating item budget, with payload of \n${logUtil(
            //     createdItemBudgetPayload,
            //   )}`,
            // );
            await prismaTrans.proposal_item_budget.createMany({
              data: createdItemBudgetPayload,
            });
          }

          if (updatedItemBudgetPayload && updatedItemBudgetPayload.length > 0) {
            for (let i = 0; i < updatedItemBudgetPayload.length; i++) {
              // this.logger.log(
              //   'info',
              //   `updating item budget ${
              //     updatedItemBudgetPayload[i].id
              //   }, with payload of \n${logUtil(updatedItemBudgetPayload[i])}`,
              // );
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
            // this.logger.log(
            //   'info',
            //   `deleting item budget with id of \n${logUtil(
            //     deletedItemBudgetIds,
            //   )}`,
            // );
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
            // this.logger.log(
            //   'info',
            //   `creating recommended support with payload of \n${logUtil(
            //     createdRecommendedSupportPayload,
            //   )}`,
            // );
            await prismaTrans.recommended_support_consultant.createMany({
              data: createdRecommendedSupportPayload,
            });
          }

          if (
            updatedRecommendedSupportPayload &&
            updatedRecommendedSupportPayload.length > 0
          ) {
            for (let i = 0; i < updatedRecommendedSupportPayload.length; i++) {
              // this.logger.log(
              //   'info',
              //   `updating item budget ${
              //     updatedRecommendedSupportPayload[i].id
              //   }, with payload of \n${logUtil(
              //     updatedRecommendedSupportPayload[i],
              //   )}`,
              // );
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
            // this.logger.log(
            //   'info',
            //   `deleting recommend support with id of \n${logUtil(
            //     deletedRecommendedSupportIds,
            //   )}`,
            // );
            await prismaTrans.recommended_support_consultant.deleteMany({
              where: {
                id: {
                  in: [...deletedRecommendedSupportIds],
                },
              },
            });
          }
          /* Crud recommend support payload ------------------------------------------------------------ */

          // console.log(logUtil(proposal_logs));
          // throw new BadRequestException('debug!');

          return {
            proposal,
            proposal_logs,
          };
        },
        { maxWait: 1500000, timeout: 1500000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
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
        ProposalRepository.name,
        'fetchTrack Error:',
        `fetching proposal tracks!`,
      );
      throw theError;
    }
  }

  async findTrackById(id: string) {
    try {
      return await this.prismaService.track.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        ProposalRepository.name,
        'fetchTracks Error:',
        `fetching proposal tracks!`,
      );
      throw theError;
    }
  }
}
