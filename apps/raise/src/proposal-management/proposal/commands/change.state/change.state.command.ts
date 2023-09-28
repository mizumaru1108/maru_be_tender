import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { InvalidTrackIdException } from '../../../../track-management/track/exceptions/invalid-track-id.excception';
import { TrackRepository } from '../../../../track-management/track/repositories/track.repository';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateItemBugetProps,
  ProposalItemBudgetRepository,
  UpdateItemBugetProps,
} from '../../../item-budget/repositories/proposal.item.budget.repository';
import {
  CreateProposalLogProps,
  ProposalLogRepository,
} from '../../../proposal-log/repositories/proposal.log.repository';
import { ChangeProposalStateDto } from '../../dtos/requests';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ForbiddenChangeStateActionException } from '../../exceptions/forbidden-change-state-action.exception';
import { ProposalNotFoundException } from '../../exceptions/proposal-not-found.exception';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalUpdateProps } from '../../types';
/* Command is specific for doing business logic, please dont do query here, you are only allowed to use prisma to start and end a sessions */
export class ChangeStateCommand {
  currentUser: TenderCurrentUser;
  request: ChangeProposalStateDto;
}

export interface EachRoleChangeStateCommandResponse {
  proposalUpdateProps?: ProposalUpdateProps;
  proposalLogCreateProps?: CreateProposalLogProps;
}
@CommandHandler(ChangeStateCommand)
export class ChangeStateCommandHandler
  implements ICommandHandler<ChangeStateCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly trackRepo: TrackRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly itemBudgetRepo: ProposalItemBudgetRepository,
  ) {}

  async applyChanges(
    proposalUpdateProps: ProposalUpdateProps,
    proposalLogCreateProps: CreateProposalLogProps,
    session?: PrismaService,
  ) {
    const updatedProposal = await this.proposalRepo.update(
      proposalUpdateProps,
      session,
    );
    const createdLogs = await this.logRepo.create(
      proposalLogCreateProps,
      session,
    );

    return {
      updatedProposal,
      createdLogs,
    };
  }

  async handleModeratorAction(
    request: ChangeProposalStateDto,
    session?: PrismaService,
  ) {
    try {
      if (
        [ProposalAction.ACCEPT, ProposalAction.REJECT].indexOf(request.action) <
        0
      ) {
        throw new ForbiddenChangeStateActionException(`${request.action}`);
      }

      const proposalUpdateProps: ProposalUpdateProps = {
        id: request.proposal_id,
      };

      const proposalLogCreateProps: CreateProposalLogProps = {
        id: nanoid(),
        state: TenderAppRoleEnum.MODERATOR,
        user_role: TenderAppRoleEnum.MODERATOR,
        proposal_id: request.proposal_id,
      };

      // handle accept action for moderator
      if (request.action === ProposalAction.ACCEPT) {
        if (!request.moderator_payload) {
          throw new PayloadErrorException(`Moderator Payload is Required!`);
        }

        /* validating track */
        const validTrack = await this.trackRepo.findFirst(
          {
            id: request.moderator_payload.track_id,
          },
          session,
        );

        if (!validTrack) {
          throw new InvalidTrackIdException(
            `${request.moderator_payload.track_id}`,
          );
        }

        proposalUpdateProps.inner_status =
          InnerStatusEnum.ACCEPTED_BY_MODERATOR;
        proposalUpdateProps.outter_status = OutterStatusEnum.ONGOING;
        proposalUpdateProps.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
        proposalUpdateProps.track_id = validTrack.id;

        /* if track not ALL, only for supervisor in defined track */
        if (request.moderator_payload.supervisor_id) {
          proposalUpdateProps.supervisor_id =
            request.moderator_payload.supervisor_id;
        }

        /* log props */
        proposalLogCreateProps.action = ProposalAction.ACCEPT;
      }

      if (request.action === ProposalAction.REJECT) {
        if (!request.reject_reason) {
          throw new PayloadErrorException('reject reason is required');
        }
        /* proposal */
        proposalUpdateProps.inner_status =
          InnerStatusEnum.REJECTED_BY_MODERATOR;
        proposalUpdateProps.outter_status = OutterStatusEnum.CANCELED;
        proposalUpdateProps.state = TenderAppRoleEnum.MODERATOR;

        /* log */
        proposalLogCreateProps.action = ProposalAction.REJECT;
        proposalLogCreateProps.reject_reason = request.reject_reason;
      }

      return await this.applyChanges(
        proposalUpdateProps,
        proposalLogCreateProps,
        session,
      );
    } catch (error) {
      throw error;
    }
  }

  async handleSupervisorAction(
    currentUser: TenderCurrentUser,
    request: ChangeProposalStateDto,
    proposal: ProposalEntity,
    session?: PrismaService,
  ) {
    /* supervisor only allowed to acc and reject and step back */
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.STEP_BACK,
      ].indexOf(request.action) < 0
    ) {
      throw new ForbiddenChangeStateActionException(`${request.action}`);
    }

    const proposalUpdateProps = Builder<ProposalUpdateProps>(
      ProposalUpdateProps,
      {
        id: request.proposal_id,
        inner_status: InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
        outter_status: OutterStatusEnum.ONGOING,
        state: TenderAppRoleEnum.PROJECT_MANAGER,
        supervisor_id: currentUser.id,
      },
    ).build();

    const proposalLogCreateProps: CreateProposalLogProps = {
      id: nanoid(),
      state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
      user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
      proposal_id: request.proposal_id,
    };

    /* acc */
    if (request.action === ProposalAction.ACCEPT) {
      if (!request.supervisor_payload) {
        throw new PayloadErrorException(
          'Supervisor accept payload is required!',
        );
      }

      /* applying changes */
      proposalUpdateProps.inclu_or_exclu =
        request.supervisor_payload.inclu_or_exclu;
      proposalUpdateProps.vat_percentage =
        request.supervisor_payload.vat_percentage;
      proposalUpdateProps.support_goal_id =
        request.supervisor_payload.support_goal_id;
      proposalUpdateProps.vat = request.supervisor_payload.vat;
      proposalUpdateProps.support_outputs =
        request.supervisor_payload.support_outputs;
      proposalUpdateProps.number_of_payments_by_supervisor =
        request.supervisor_payload.number_of_payments_by_supervisor;
      proposalUpdateProps.fsupport_by_supervisor =
        request.supervisor_payload.fsupport_by_supervisor;
      proposalUpdateProps.does_an_agreement =
        request.supervisor_payload.does_an_agreement;
      proposalUpdateProps.need_picture =
        request.supervisor_payload.need_picture;
      proposalUpdateProps.closing_report =
        request.supervisor_payload.closing_report;
      proposalUpdateProps.support_type =
        request.supervisor_payload.support_type;
      proposalUpdateProps.clause = request.supervisor_payload.clause;
      proposalUpdateProps.clasification_field =
        request.supervisor_payload.clasification_field;

      const {
        created_proposal_budget,
        deleted_proposal_budget,
        updated_proposal_budget,
      } = request.supervisor_payload;

      // creating the item budget
      if (
        created_proposal_budget !== undefined &&
        created_proposal_budget.length > 0
      ) {
        for (const createBudget of created_proposal_budget) {
          const createBudgetProps: CreateItemBugetProps =
            Builder<CreateItemBugetProps>(CreateItemBugetProps, {
              ...createBudget,
              id: uuidv4(),
              proposal_id: request.proposal_id,
            }).build();
          await this.itemBudgetRepo.create(createBudgetProps, session);
        }
      }

      // updating item budget
      if (
        updated_proposal_budget !== undefined &&
        updated_proposal_budget.length > 0
      ) {
        for (const updateBudget of updated_proposal_budget) {
          const updateBudgetProps: UpdateItemBugetProps =
            Builder<UpdateItemBugetProps>(UpdateItemBugetProps, {
              ...updateBudget,
            }).build();
          await this.itemBudgetRepo.update(updateBudgetProps, session);
        }
      }

      if (deleted_proposal_budget && deleted_proposal_budget.length > 0) {
        for (const itemBudget of deleted_proposal_budget) {
          await this.itemBudgetRepo.deleteById(itemBudget.id, session);
        }
      }

      //   /* custom logic if the track is CONCESSIONAL_GRANTS */
      if (proposal?.track?.with_consultation === true) {
        const {
          accreditation_type_id,
          chairman_of_board_of_directors,
          most_clents_projects,
          been_supported_before,
          added_value,
          reasons_to_accept,
          target_group_num,
          target_group_type,
          target_group_age,
          been_made_before,
          remote_or_insite,
        } = request.supervisor_payload;

        proposalUpdateProps.accreditation_type_id = accreditation_type_id;
        proposalUpdateProps.chairman_of_board_of_directors =
          chairman_of_board_of_directors;
        proposalUpdateProps.most_clents_projects = most_clents_projects;
        proposalUpdateProps.been_supported_before = been_supported_before;
        proposalUpdateProps.added_value = added_value;
        proposalUpdateProps.reasons_to_accept = reasons_to_accept;
        proposalUpdateProps.target_group_num = target_group_num;
        proposalUpdateProps.target_group_type = target_group_type;
        proposalUpdateProps.target_group_age = target_group_age;
        proposalUpdateProps.been_made_before = been_made_before;
        proposalUpdateProps.remote_or_insite = remote_or_insite;
      }

      // add changes to log
      proposalLogCreateProps.action = ProposalAction.ACCEPT;
      proposalLogCreateProps.new_values = {
        ...proposalUpdateProps,
        createdItemBudgetPayload: created_proposal_budget,
        updatedItemBudgetPayload: updated_proposal_budget,
        deletedItemBudgetIds: deleted_proposal_budget,
      };
    }

    // /* reject (same for grants and not grants) DONE */
    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdateProps.inner_status = 'REJECTED_BY_SUPERVISOR';
      proposalUpdateProps.outter_status = 'CANCELED';
      proposalUpdateProps.state = 'PROJECT_SUPERVISOR';
      proposalUpdateProps.supervisor_id = currentUser.id;

      /* log */
      proposalLogCreateProps.action = ProposalAction.REJECT;
      proposalLogCreateProps.state = 'PROJECT_SUPERVISOR';
      proposalLogCreateProps.user_role = 'PROJECT_SUPERVISOR';
      proposalLogCreateProps.reject_reason = request.reject_reason;
    }

    // /* step back (same for grants and not grants) DONE */
    if (request.action === ProposalAction.STEP_BACK) {
      /* proposal */
      proposalUpdateProps.inner_status = 'CREATED_BY_CLIENT';
      proposalUpdateProps.outter_status = 'ONGOING';
      proposalUpdateProps.state = 'MODERATOR';

      /* log */
      proposalLogCreateProps.action = ProposalAction.STEP_BACK;
      proposalLogCreateProps.state = 'PROJECT_SUPERVISOR';
      proposalLogCreateProps.user_role = 'PROJECT_SUPERVISOR';
    }

    // apply updates to proposal
    await this.proposalRepo.update(proposalUpdateProps, session);

    // cerate logs
    await this.logRepo.create(proposalLogCreateProps, session);
  }

  async handlePmAction() {}

  async execute(command: ChangeStateCommand): Promise<any> {
    const { currentUser, request } = command;

    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        // typing the prisma session
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const proposal = await this.proposalRepo.fetchById(
          {
            id: request.proposal_id,
          },
          session,
        );
        if (!proposal) throw new ProposalNotFoundException();

        // get the last log
        const lastLog = await this.logRepo.findMany(
          {
            proposal_id: proposal.id,
            page: 1,
            limit: 1,
            sort_by: 'created_at',
            sort_direction: 'desc',
          },
          session,
        );

        switch (currentUser.choosenRole) {
          case 'tender_moderator':
            return await this.handleModeratorAction(request, session);
          case 'tender_project_supervisor':
            return await this.handleSupervisorAction(
              currentUser,
              request,
              proposal,
              session,
            );
          // case 'tender_project_manager':
          //   return await this.handlePmAction(currentUser, request, session);
          default:
            return null;
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
