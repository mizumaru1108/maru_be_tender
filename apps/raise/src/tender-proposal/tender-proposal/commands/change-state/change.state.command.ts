import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PayloadRequiredException } from '../../../../tender-commons/exceptions/payload-required.exception';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { InvalidTrackIdException } from '../../../../tender-track/track/exceptions/invalid-track-id.excception';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalLogProps,
  TenderProposalLogRepository,
} from '../../../tender-proposal-log/repositories/tender-proposal-log.repository';
import { ChangeProposalStateDto } from '../../dtos/requests';
import { ForbiddenChangeStateActionException } from '../../exceptions/forbidden-change-state-action.exception';
import { ProposalNotFoundException } from '../../exceptions/proposal-not-found.exception';
import {
  TenderProposalRepository,
  UpdateProposalProps,
} from '../../repositories/tender-proposal.repository';
import { TenderTrackRepository } from '../../../../tender-track/track/repositories/tender-track.repository';
import { Builder } from 'builder-pattern';
/* Command is specific for doing business logic, please dont do query here, you are only allowed to use prisma to start and end a sessions */
export class ChangeStateCommand {
  currentUser: TenderCurrentUser;
  request: ChangeProposalStateDto;
}

export interface EachRoleChangeStateCommandResponse {
  proposalUpdateProps?: UpdateProposalProps;
  proposalLogCreateProps?: CreateProposalLogProps;
}
@CommandHandler(ChangeStateCommand)
export class ChangeStateCommandHandler
  implements ICommandHandler<ChangeStateCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: TenderProposalRepository,
    private readonly trackRepo: TenderTrackRepository,
    private readonly logRepo: TenderProposalLogRepository,
  ) {}

  async applyChanges(
    proposalUpdateProps: UpdateProposalProps,
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

      const proposalUpdateProps: UpdateProposalProps = {
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
          throw new PayloadRequiredException(`Moderator Payload`);
        }

        /* validating track */
        const validTrack = await this.trackRepo.fetchById(
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
          throw new PayloadRequiredException('reject reason');
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
    const proposalLogCreateProps: CreateProposalLogProps = {
      id: nanoid(),
      state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
      user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
      proposal_id: request.proposal_id,
    };

    const proposalUpdateProps = Builder<UpdateProposalProps>(
      UpdateProposalProps,
      {
        id: request.proposal_id,
        inner_status: InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
        outter_status: OutterStatusEnum.ONGOING,
        state: TenderAppRoleEnum.PROJECT_MANAGER,
        supervisor_id: currentUser.id,
      },
    ).build();

    /* acc */
    if (request.action === ProposalAction.ACCEPT) {
      if (!request.supervisor_payload) {
        throw new PayloadRequiredException(
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

      //   /* if there's a new created item budget */
      //   createdItemBudgetPayload = SupervisorAccCreatedItemBudgetMapper(
      //     request.proposal_id,
      //     created_proposal_budget,
      //     createdItemBudgetPayload,
      //   );

      //   if (updated_proposal_budget && updated_proposal_budget.length > 0) {
      //     for (let i = 0; i < updated_proposal_budget.length; i++) {
      //       updatedItemBudgetPayload.push({
      //         id: updated_proposal_budget[i].id,
      //         amount: updated_proposal_budget[i].amount,
      //         clause: updated_proposal_budget[i].clause,
      //         explanation: updated_proposal_budget[i].explanation,
      //       });
      //     }
      //   }

      //   if (deleted_proposal_budget && deleted_proposal_budget.length > 0) {
      //     for (const itemBudget of deleted_proposal_budget) {
      //       deletedItemBudgetIds.push(itemBudget.id);
      //     }
      //   }

      //   proposalUpdatePayload.inner_status =
      //     InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
      //   proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      //   proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;
      //   proposalUpdatePayload.supervisor_id = currentUser.id;

      //   /* custom logic if the track is CONCESSIONAL_GRANTS */
      //   if (proposal?.track?.with_consultation === true) {
      //     proposalUpdatePayload = SupervisorGrantTrackAccMapper(
      //       proposalUpdatePayload,
      //       request.supervisor_payload,
      //     );
      //   }

      //   /* accept supervisor logs */
      //   proposalLogCreateInput.action = ProposalAction.ACCEPT;
      //   proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      //   proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      //   proposalLogCreateInput.new_values = {
      //     ...proposalUpdatePayload,
      //     createdItemBudgetPayload,
      //     updatedItemBudgetPayload,
      //     deletedItemBudgetIds,
      //   } as Prisma.InputJsonValue;
    }

    // /* reject (same for grants and not grants) DONE */
    // if (request.action === ProposalAction.REJECT) {
    //   /* proposal */
    //   proposalUpdatePayload.inner_status = 'REJECTED_BY_SUPERVISOR';
    //   proposalUpdatePayload.outter_status = 'CANCELED';
    //   proposalUpdatePayload.state = 'PROJECT_SUPERVISOR';
    //   proposalUpdatePayload.supervisor_id = currentUser.id;

    //   /* log */
    //   proposalLogCreateInput.action = ProposalAction.REJECT;
    //   proposalLogCreateInput.state = 'PROJECT_SUPERVISOR';
    //   proposalLogCreateInput.user_role = 'PROJECT_SUPERVISOR';
    // }

    // /* step back (same for grants and not grants) DONE */
    // if (request.action === ProposalAction.STEP_BACK) {
    //   /* proposal */
    //   proposalUpdatePayload.inner_status = 'CREATED_BY_CLIENT';
    //   proposalUpdatePayload.outter_status = 'ONGOING';
    //   proposalUpdatePayload.state = 'MODERATOR';

    //   /* log */
    //   proposalLogCreateInput.action = ProposalAction.STEP_BACK;
    //   proposalLogCreateInput.state = 'PROJECT_SUPERVISOR';
    //   proposalLogCreateInput.user_role = 'PROJECT_SUPERVISOR';
    // }

    // return {
    //   proposalUpdatePayload,
    //   proposalLogCreateInput,
    //   createdItemBudgetPayload,
    //   updatedItemBudgetPayload,
    //   deletedItemBudgetIds,
    // };
    return await this.applyChanges(
      proposalUpdateProps,
      proposalLogCreateProps,
      session,
    );
  }

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

        const proposalLogCreateProps: CreateProposalLogProps = {
          id: nanoid(),
          state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
          user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
          proposal_id: request.proposal_id,
        };

        switch (currentUser.choosenRole) {
          case 'tender_moderator':
            return await this.handleModeratorAction(request, session);
          case 'tender_project_supervisor':
            return await this.handleSupervisorAction(currentUser, request);
          default:
            return null;
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
