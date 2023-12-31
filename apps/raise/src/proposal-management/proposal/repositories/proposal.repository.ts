import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PaymentStatusEnum } from 'src/proposal-management/payment/types/enums/payment.status.enum';
import { logUtil } from '../../../commons/utils/log-util';
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
import { ProposalLogActionEnum } from '../../proposal-log/types/enums/proposal.log.action.enum';
import { ProposalSelectEnum } from '../dtos/queries/proposal.report.list.query.dto';
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
import { ProposalEntity } from '../entities/proposal.entity';
import { ProposalMapper } from '../mapper/proposal.mapper';
import {
  ProposalCreateProps,
  ProposalDeleteManyProps,
  ProposalDeleteProps,
  ProposalFetchByIdProps,
  ProposalFindManyProps,
  ProposalIncludeRelationsTypes,
  ProposalUpdateProps,
} from '../types';

@Injectable()
export class ProposalRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalMapper: ProposalMapper,
    @InjectPinoLogger(ProposalRepository.name) private logger: PinoLogger,
  ) {}

  applyFilter(
    include_relations: ProposalIncludeRelationsTypes[],
  ): Prisma.proposalInclude {
    let include: Prisma.proposalInclude = {};

    for (const relation of include_relations) {
      if (relation === 'user') {
        include = {
          ...include,
          user: {
            select: {
              id: true,
              email: true,
              mobile_number: true,
              employee_name: true,
              client_data: {
                include: {
                  authority_detail: true,
                  client_field_details: true,
                },
              },
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

      if (relation === 'governorate_detail') {
        include = {
          ...include,
          governorate_detail: true,
        };
      }

      if (relation === 'region_detail') {
        include = {
          ...include,
          region_detail: true,
        };
      }

      if (relation === 'proposal_closing_report') {
        include = {
          ...include,
          proposal_closing_report: {
            include: {
              beneficiaries: true,
              execution_places: true,
              genders: true,
            },
          },
        };
      }

      if (relation === 'proposal_governorates') {
        include = {
          ...include,
          proposal_governorates: {
            include: {
              governorate: true,
            },
          },
        };
      }

      if (relation === 'proposal_regions') {
        include = {
          ...include,
          proposal_regions: {
            include: {
              region: true,
            },
          },
        };
      }
    }

    return include;
  }

  async findByIdFilter(
    props: ProposalFetchByIdProps,
  ): Promise<Prisma.proposalFindFirstArgs> {
    const { include_relations } = props;

    let findByIdFilter: Prisma.proposalFindFirstArgs = {
      where: { id: props.id },
    };

    if (include_relations && include_relations.length > 0) {
      findByIdFilter.include = this.applyFilter(include_relations);
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
      const rawProposal = await prisma.proposal.findFirst({
        where: filterQuery.where,
        include: filterQuery.include,
      });

      if (!rawProposal) return null;

      const proposalByIdEntity = await this.proposalMapper.toDomain(
        rawProposal,
      );

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
          governorate_id: props.governorate_id,
          id: props.id || nanoid(),
          inclu_or_exclu: props.inclu_or_exclu,
          incoming: props.incoming,
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
          region_id: props.region_id,
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

      const updatedProposalEntity =
        this.proposalMapper.toDomain(rawUpdatedProposal);

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
          governorate_id: props.governorate_id,
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
          region_id: props.region_id,
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

      const createdProposalEntity =
        this.proposalMapper.toDomain(rawCreatedProposal);

      // console.log('created entity', createdProposalEntity);
      return createdProposalEntity;
    } catch (error) {
      this.logger.error('Error on creating proposal =%j', error);
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

      const deletedProposalEntity = this.proposalMapper.toDomain(rawDeleteRes);
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

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async deleteMany(props: ProposalDeleteManyProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      if (!props.ids && !props.user_ids) {
        throw new BadRequestException(
          'At least one of ids or user_ids is required',
        );
      }

      let whereClause: Prisma.proposalWhereInput = {};

      if (props.ids) {
        whereClause = {
          ...whereClause,
          id: {
            in: props.ids,
          },
        };
      }

      if (props.user_ids) {
        whereClause = {
          ...whereClause,
          OR: [
            { submitter_user_id: { in: props.user_ids } },
            { supervisor_id: { in: props.user_ids } },
            { cashier_id: { in: props.user_ids } },
            { finance_id: { in: props.user_ids } },
          ],
        };
      }

      const rawDeleteRes = await prisma.proposal.deleteMany({
        where: whereClause,
      });

      return rawDeleteRes.count;
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

  /* Latest, already able to do passing session, and return entity instead of prisma model*/
  async findManyFilter(props: ProposalFindManyProps) {
    const {
      partner_name,
      partner_id,
      track_id,
      governorate_id,
      region_id,
      submitter_user_id,
      outter_status,
      beneficiary_id,
      include_relations,
      selected_columns,
      start_date,
      end_date,
      step,
      stepNotIn,
    } = props;
    // console.log({ props });
    let args: Prisma.proposalFindManyArgs = {};
    let whereClause: Prisma.proposalWhereInput = {};

    if (track_id) {
      whereClause = {
        ...whereClause,
        track_id: {
          in: track_id,
        },
      };
    }

    if (step) {
      whereClause = {
        ...whereClause,
        step: {
          in: step,
        },
      };
    }

    if (stepNotIn) {
      whereClause = {
        ...whereClause,
        step: {
          notIn: stepNotIn,
        },
      };
    }

    if (partner_name) {
      whereClause = {
        ...whereClause,
        user: {
          employee_name: {
            contains: partner_name,
            mode: 'insensitive',
          },
        },
      };
    }

    if (partner_id) {
      whereClause = {
        ...whereClause,
        submitter_user_id: {
          in: partner_id,
        },
      };
    }

    if (region_id) {
      whereClause = {
        ...whereClause,
        region_id: { in: region_id },
      };
    }

    if (governorate_id) {
      whereClause = {
        ...whereClause,
        governorate_id: { in: governorate_id },
      };
    }

    if (outter_status) {
      whereClause = {
        ...whereClause,
        outter_status: { in: outter_status },
      };
    }

    if (beneficiary_id) {
      whereClause = {
        ...whereClause,
        beneficiary_id: { in: beneficiary_id },
      };
    }

    if (submitter_user_id) {
      whereClause = {
        ...whereClause,
        submitter_user_id,
      };
    }

    if (start_date) {
      whereClause = {
        ...whereClause,
        created_at: {
          gte: start_date,
        },
      };
    }

    if (end_date) {
      whereClause = {
        ...whereClause,
        created_at: {
          lte: end_date,
        },
      };
    }

    if (start_date && end_date) {
      whereClause = {
        ...whereClause,
        created_at: {
          gte: start_date,
          lte: end_date,
        },
      };
    }

    if (include_relations && include_relations.length > 0) {
      let include: Prisma.proposalInclude = {};

      for (const relation of include_relations) {
        if (relation === 'user') {
          include = {
            ...include,
            user: {
              select: {
                id: true,
                email: true,
                mobile_number: true,
                employee_name: true,
                client_data: {
                  include: {
                    authority_detail: true,
                    client_field_details: true,
                  },
                },
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

        if (relation === 'proposal_closing_report') {
          include = {
            ...include,
            proposal_closing_report: {
              include: {
                beneficiaries: true,
                execution_places: true,
                genders: true,
              },
            },
          };
        }

        if (relation === 'governorate_detail') {
          include = {
            ...include,
            governorate_detail: true,
          };
        }

        if (relation === 'region_detail') {
          include = {
            ...include,
            region_detail: true,
          };
        }
      }

      args.include = include;
    }

    if (selected_columns && selected_columns.length > 0) {
      let ps: Prisma.proposalSelect = {
        id: true,
      };
      let bankInfoSelectArgs: Prisma.bank_informationSelect = {};
      let userInfoSelectArgs: Prisma.userSelect = {};
      for (const selected of selected_columns) {
        if (selected === ProposalSelectEnum.AMOUNT_REQUIRED_FSUPPORT) {
          ps.amount_required_fsupport = true;
        }
        if (selected === ProposalSelectEnum.BANK_ACCOUNT_NAME) {
          bankInfoSelectArgs = {
            ...bankInfoSelectArgs,
            bank_account_name: true,
          };
          ps = {
            ...ps,
            bank_information: { select: { ...bankInfoSelectArgs } },
          };
        }
        if (selected === ProposalSelectEnum.BANK_ACCOUNT_NUMBER) {
          bankInfoSelectArgs = {
            ...bankInfoSelectArgs,
            bank_account_number: true,
          };
          ps = {
            ...ps,
            bank_information: { select: { ...bankInfoSelectArgs } },
          };
        }
        if (selected === ProposalSelectEnum.BANK_NAME) {
          bankInfoSelectArgs = { ...bankInfoSelectArgs, bank_name: true };
          ps = {
            ...ps,
            bank_information: { select: { ...bankInfoSelectArgs } },
          };
        }
        if (selected === ProposalSelectEnum.EMAIL) {
          ps = { ...ps, user: { select: { email: true } } };
        }
        if (selected === ProposalSelectEnum.EXECUTION_TIME) {
          ps = { ...ps, execution_time: true };
        }
        if (selected === ProposalSelectEnum.GOVERNORATE) {
          ps.governorate = true;
          ps.governorate_detail = true;
        }
        if (selected === ProposalSelectEnum.MOBILE_NUMBER) {
          userInfoSelectArgs = { ...userInfoSelectArgs, mobile_number: true };
          ps = { ...ps, user: { select: { ...userInfoSelectArgs } } };
        }
        if (selected === ProposalSelectEnum.NUM_OFPROJECT_BINICFICIARIES) {
          ps.num_ofproject_binicficiaries = true;
        }
        if (selected === ProposalSelectEnum.PM_NAME) ps.pm_name = true;
        if (selected === ProposalSelectEnum.PROJECET_LOCATION) {
          ps.project_location = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_BENEFICIARIES) {
          ps.beneficiary_details = true;
          ps.project_beneficiaries = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_GOALS) {
          ps.project_goals = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_IDEA) {
          ps.project_idea = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_IMPLEMENT_DATE) {
          ps.project_implement_date = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_LOCATION) {
          ps.project_location = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_NAME) {
          ps.project_name = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_OUTPUTS) {
          ps.project_outputs = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_RISKS) {
          ps.project_risks = true;
        }
        if (selected === ProposalSelectEnum.PROJECT_STRENGTHS) {
          ps.project_strengths = true;
        }
        if (selected === ProposalSelectEnum.REGION) {
          ps.region = true;
          ps.region_detail = true;
        }

        if (start_date || end_date) {
          ps.created_at = true;
          // ps.updated_at = true;
        }
      }
      // console.log(logUtil(ps));
      args.select = ps;
    }

    args.where = whereClause;

    // console.log(logUtil(args));
    return args;
  }

  async findMany(
    props: ProposalFindManyProps,
    session?: PrismaService,
  ): Promise<ProposalEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.proposalFindManyArgs = {
        where: args.where,
        orderBy: {
          [getSortBy]: getSortDirection,
        },
      };

      if (args.include) {
        queryOptions = { ...queryOptions, include: args.include };
      }

      if (args.select) queryOptions = { ...queryOptions, select: args.select };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      // console.log({ queryOptions });
      const rawResult = await prisma.proposal.findMany(queryOptions);
      const entities = this.proposalMapper.toDomainList(rawResult);

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: ProposalFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.proposal.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
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
              region_id: true,
              region_detail: true,
              governorate: true,
              governorate_id: true,
              governorate_detail: true,
              proposal_item_budgets: true,
              project_timeline: true,
              beneficiary_id: true,
              proposal_bank_id: true,
              bank_information: true,
              proposal_governorates: {
                include: {
                  governorate: true,
                },
              },
              proposal_regions: {
                include: {
                  region: true,
                },
              },
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
            include: {
              track: true,
            },
          });
          if (!reviewer || !reviewer.track) {
            throw new BadRequestException('cant find track of this user');
          }

          if (reviewer.track.name !== 'GENERAL') {
            whereClause = {
              ...whereClause,
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
          // whereClause = {
          //   ...whereClause,
          //   inner_status: {
          //     in: [
          //       InnerStatusEnum.ACCEPTED_BY_CONSULTANT,
          //       InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
          //     ],
          //   },
          // };
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

        if (currentUser.choosenRole === 'tender_auditor_report') {
          whereClause = {
            ...whereClause,
            inner_status: InnerStatusEnum.PROJECT_COMPLETED,
            outter_status: OutterStatusEnum.COMPLETED,
            // at least has one proposal closing report
            proposal_closing_report: {
              every: { id: { not: '' } },
            },
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
      if (project_number && !isNaN(+project_number)) {
        orClauses.push({
          project_number: +project_number,
        });
      }

      // console.log('outter', logUtil(outterClauses));
      // console.log('where', logUtil(whereClause));
      // console.log('or', logUtil(orClauses));

      const data = await this.prismaService.proposal.findMany({
        where: {
          AND: [whereClause, { OR: [...orClauses] }, outterClauses],
        },
        take: limit,
        skip: offset,
        include: {
          // add propsal log relation for get many
          proposal_logs: {
            orderBy: {
              created_at: 'asc',
            },
          },
          payments: {
            orderBy: {
              created_at: 'asc',
            },
          },
          user: {
            include: {
              client_data: true,
            },
          },
          region_detail: true,
          governorate_detail: true,
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
          governorate_detail: true,
          region_detail: true,
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
        sorting_field = 'updated_at',
        type = 'incoming',
        vat,
        track_id,
        project_name,
        range_end_date,
        range_start_date,
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

      if (range_start_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
          },
        };
      }

      if (range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            lte: range_end_date,
          },
        };
      }

      if (range_start_date && range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
            lte: range_end_date,
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
            // 'tender_cashier',
            // 'tender_finance',
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
            cashier_id: currentUser.id,
            finance_id: { not: null },
            inner_status:
              InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
          };
        }

        if (currentUser.choosenRole === 'tender_finance') {
          // whereClause = {
          //   ...whereClause,
          //   payments: {
          //     some: {
          //       status: {
          //         in: [
          //           PaymentStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
          //           PaymentStatusEnum.UPLOADED_BY_CASHIER,
          //         ],
          //       },
          //     },
          //   },
          // };
          whereClause = {
            ...whereClause,
            incoming: false,
            finance_id: currentUser.id,
            outter_status: {
              equals: OutterStatusEnum.ONGOING,
            },
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
            proposal_logs: {
              some: {
                OR: [
                  {
                    // user role cashier, action between upload by cashier and step back
                    AND: {
                      user_role: TenderAppRoleEnum.CASHIER,
                      action: {
                        in: [
                          ProposalLogActionEnum.UPLOADED_BY_CASHIER,
                          ProposalLogActionEnum.STEP_BACK,
                        ],
                      },
                    },
                  },
                  {
                    // action pm acc by project manager/ user role project manager,
                    AND: {
                      user_role: TenderAppRoleEnum.PROJECT_MANAGER,
                      action: {
                        in: [ProposalLogActionEnum.ACCEPTED_BY_PROJECT_MANAGER],
                      },
                    },
                  },
                ],
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = {
            ...whereClause,
            state: {
              in: [
                TenderAppRoleEnum.PROJECT_SUPERVISOR,
                TenderAppRoleEnum.PROJECT_MANAGER,
              ],
            },
            inner_status: {
              in: [
                InnerStatusEnum.REJECTED_BY_SUPERVISOR,
                InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
              ],
            },
            outter_status: {
              in: [OutterStatusEnum.PENDING_CANCELED, OutterStatusEnum.ONGOING],
            },
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
          // add propsal log relation for get many
          proposal_logs: {
            orderBy: {
              created_at: 'asc',
            },
          },
          user: {
            include: {
              client_data: true,
            },
          },
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

      // console.log(logUtil(whereClause));
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
        client_name,
        start_date,
        outter_status,
        project_name,
        range_end_date,
        range_start_date,
        track_id,
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

      if (outter_status) {
        whereClause = {
          ...whereClause,
          outter_status: { in: outter_status },
        };
      }

      if (client_name) {
        whereClause = {
          ...whereClause,
          user: {
            employee_name: { contains: client_name, mode: 'insensitive' },
          },
        };
      }

      if (start_date) {
        whereClause = {
          ...whereClause,
          project_timeline: {
            some: {
              start_date: { equals: start_date },
            },
          },
        };
      }

      if (range_start_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
          },
        };
      }

      if (range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            lte: range_end_date,
          },
        };
      }

      if (range_start_date && range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
            lte: range_end_date,
          },
        };
      }

      if (track_id) {
        whereClause = {
          ...whereClause,
          // track_id,
          track_id: { in: track_id },
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
            proposal_logs: {
              some: {
                AND: {
                  user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
                  action: {
                    in: [
                      ProposalLogActionEnum.ACCEPT,
                      ProposalLogActionEnum.UPDATE,
                      ProposalLogActionEnum.REJECT,
                      ProposalLogActionEnum.ASK_FOR_AMANDEMENT_REQUEST,
                      ProposalLogActionEnum.SEND_BACK_FOR_REVISION,
                      ProposalLogActionEnum.REJECT_AMANDEMENT_PAYMENT,
                    ],
                  },
                },
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_cashier') {
          whereClause = {
            ...whereClause,
            OR: [{ cashier_id: currentUser.id }, { cashier_id: null }],
            proposal_logs: {
              some: {
                AND: {
                  user_role: TenderAppRoleEnum.CASHIER,
                  action: {
                    in: [ProposalLogActionEnum.UPLOADED_BY_CASHIER],
                  },
                },
              },
            },
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
            proposal_logs: {
              some: {
                AND: {
                  user_role: TenderAppRoleEnum.FINANCE,
                  action: {
                    in: [
                      ProposalLogActionEnum.ASK_FOR_AMANDEMENT_REQUEST,
                      ProposalLogActionEnum.ACCEPTED_BY_FINANCE,
                      ProposalLogActionEnum.DONE,
                    ],
                  },
                },
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_project_manager') {
          whereClause = {
            ...whereClause,
            OR: [
              { project_manager_id: currentUser.id },
              {
                project_manager_id: null,
              },
            ],
            proposal_logs: {
              some: {
                AND: {
                  user_role: TenderAppRoleEnum.PROJECT_MANAGER,
                  action: {
                    in: [
                      ProposalLogActionEnum.ACCEPT,
                      ProposalLogActionEnum.REJECT,
                      ProposalLogActionEnum.UPDATE,
                      ProposalLogActionEnum.STEP_BACK,
                    ],
                  },
                },
              },
            },
          };
        }

        if (currentUser.choosenRole === 'tender_ceo') {
          whereClause = {
            ...whereClause,
            proposal_logs: {
              some: {
                AND: {
                  user_role: TenderAppRoleEnum.CEO,
                  action: {
                    in: [
                      ProposalLogActionEnum.ACCEPT,
                      ProposalLogActionEnum.UPDATE,
                      ProposalLogActionEnum.STEP_BACK,
                      ProposalLogActionEnum.REJECT,
                    ],
                  },
                },
              },
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
          // add propsal log relation for get many
          proposal_logs: {
            orderBy: {
              created_at: 'asc',
            },
          },
          user: {
            include: {
              client_data: true,
            },
          },
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
        project_name,
        track_id,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      if (project_name) {
        whereClause.project_name = {
          contains: project_name,
          mode: 'insensitive',
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
      }

      // } else {
      if (track_id) {
        whereClause = {
          ...whereClause,
          track_id,
        };
      }
      // }

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

      // console.log(logUtil(whereClause));
      // console.log({ queryOptions });
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
      const {
        page = 1,
        limit = 10,
        sort = 'desc',
        project_name,
        outter_status,
        track_id,
        sorting_field,
        supervisor_status,
        range_start_date,
        range_end_date,
      } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.proposalWhereInput = {
        oid: null,
      };

      if (project_name) {
        whereClause = {
          ...whereClause,
          project_name: {
            contains: decodeURIComponent(project_name),
            mode: 'insensitive',
          },
        };
      }

      if (outter_status) {
        whereClause = {
          ...whereClause,
          outter_status: {
            in: outter_status,
          },
        };
      }

      if (track_id) {
        whereClause = {
          ...whereClause,
          track_id: {
            in: track_id,
          },
        };
      }

      if (range_start_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
          },
        };
      }

      if (range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            lte: range_end_date,
          },
        };
      }

      if (range_start_date && range_end_date) {
        whereClause = {
          ...whereClause,
          created_at: {
            gte: range_start_date,
            lte: range_end_date,
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

      whereClause = {
        ...whereClause,
        step: 'ZERO',
      };

      if (
        ['tender_project_supervisor', 'tender_project_manager'].indexOf(
          currentUser.choosenRole,
        ) > -1
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
      }

      if (currentUser.choosenRole === 'tender_project_supervisor') {
        if (supervisor_status === 'after_payment') {
          // after payment done by cashier
          whereClause = {
            ...whereClause,
            supervisor_id: currentUser.id,
            inner_status: { in: [InnerStatusEnum.DONE_BY_CASHIER] },
          };
        }

        if (supervisor_status === 'waiting_to_be_submitted') {
          whereClause = {
            ...whereClause,
            supervisor_id: currentUser.id,
            inner_status: { in: [InnerStatusEnum.REQUESTING_CLOSING_FORM] },
          };
        }
      }

      if (
        [
          'tender_project_manager',
          'tender_ceo',
          'tender_project_supervisor',
          'tender_auditor_report',
        ].indexOf(currentUser.choosenRole) > -1
      ) {
        // after client done submit closing report
        if (supervisor_status === 'after_submit') {
          whereClause = {
            ...whereClause,
            inner_status: { in: [InnerStatusEnum.PROJECT_COMPLETED] },
            outter_status: { in: [OutterStatusEnum.COMPLETED] },
            state: TenderAppRoleEnum.CLIENT,
            // there's history of sending closing report
            proposal_logs: {
              some: {
                action: ProposalAction.SENDING_CLOSING_REPORT,
              },
            },
          };
        }
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
          // add propsal log relation for get many
          proposal_logs: {
            orderBy: {
              created_at: 'asc',
            },
          },
          user: {
            include: {
              client_data: true,
            },
          },
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
      // console.log({ queryOptions });
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
        ['tender_project_supervisor', 'tender_project_manager'].indexOf(
          currentUser.choosenRole,
        ) > -1
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
          incoming: true,
          // finance_id: null,
          outter_status: {
            // notIn: [OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT],
            equals: OutterStatusEnum.ONGOING,
          },
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
          proposal_logs: {
            some: {
              OR: [
                {
                  // user role cashier, action between upload by cashier and step back
                  AND: {
                    user_role: TenderAppRoleEnum.CASHIER,
                    action: {
                      in: [
                        ProposalLogActionEnum.UPLOADED_BY_CASHIER,
                        ProposalLogActionEnum.STEP_BACK,
                      ],
                    },
                  },
                },
                {
                  // action pm acc by project manager/ user role project manager,
                  AND: {
                    user_role: TenderAppRoleEnum.PROJECT_MANAGER,
                    action: {
                      in: [ProposalLogActionEnum.ACCEPTED_BY_PROJECT_MANAGER],
                    },
                  },
                },
              ],
            },
          },
        };
      }

      if (currentUser.choosenRole === 'tender_cashier') {
        whereClause = {
          ...whereClause,
          OR: [
            // { cashier_id: currentUser.id },
            // { cashier_id: null },
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
          cashier_id: null,
          inner_status:
            InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
        };
      }

      if (type === 'incoming') {
        // Mizumaru
        // if (currentUser.choosenRole === 'tender_finance') {
        //   whereClause = { ...whereClause, finance_id: null };
        // }

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
          // add propsal log relation for get many
          proposal_logs: {
            orderBy: {
              created_at: 'asc',
            },
          },
          user: {
            include: {
              client_data: true,
            },
          },
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

      whereClause = {
        ...whereClause,
        proposal: {
          outter_status: {
            in: [
              OutterStatusEnum.ASKED_FOR_AMANDEMENT,
              OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT,
            ],
          },
        },
      };

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
                project_number: true,
                created_at: true,
                updated_at: true,
                outter_status: true,
                state: true,
                user: {
                  select: {
                    employee_name: true,
                  },
                },
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
              client_data: {
                include: {
                  authority_detail: true,
                  client_field_details: true,
                },
              },
              roles: true,
              bank_information: true,
            },
          },
          supervisor: {
            select: {
              employee_name: true,
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
              reviewer: {
                include: {
                  client_data: true,
                },
              },
            },
            orderBy: {
              created_at: 'asc',
            },
          },
          payments: {
            include: {
              cheques: true,
            },
          },
          bank_information: true,
          project_timeline: true,
          proposal_closing_report: {
            include: {
              genders: true,
              beneficiaries: true,
              execution_places: true,
            },
          },
          region_detail: true,
          governorate_detail: true,
          proposal_governorates: {
            include: {
              governorate: true,
            },
          },
          proposal_regions: {
            include: {
              region: true,
            },
          },
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
    currentUser: TenderCurrentUser,
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

          if (
            proposalLogCreateInput.action ===
            ProposalAction.REJECT_AMANDEMET_PAYMENT
          ) {
            const pending =
              await prismaTrans.proposal_asked_edit_request.findFirst({
                where: {
                  proposal_id: proposal.id,
                  status: 'PENDING',
                },
              });

            if (pending) {
              await prismaTrans.proposal_asked_edit_request.update({
                where: {
                  id: pending.id,
                },
                data: {
                  status: 'REJECTED',
                },
              });
            }
          }

          // Update payment
          if (
            currentUser &&
            currentUser.choosenRole === 'tender_cashier' &&
            proposalLogCreateInput.action === ProposalAction.STEP_BACK
          ) {
            await prismaTrans.payment.updateMany({
              where: { proposal_id: proposal.id },
              data: {
                status: PaymentStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
              },
            });
          }

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
