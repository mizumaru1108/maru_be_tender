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
/* Command is specific for doing business logic, please dont do query here, you are only allowed to use prisma to start and end a sessions */
export class ChangeStateCommand {
  currentUser: TenderCurrentUser;
  request: ChangeProposalStateDto;
}

export interface EachRoleChangeStateCommandResponse {
  proposalUpdateProps: UpdateProposalProps;
  proposalLogCreateProps: CreateProposalLogProps;
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

  async handleModeratorChangeState(
    request: ChangeProposalStateDto,
    session?: PrismaService,
  ): Promise<EachRoleChangeStateCommandResponse> {
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

      return {
        proposalUpdateProps,
        proposalLogCreateProps,
      };
    } catch (error) {
      throw error;
    }
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

        if (currentUser.choosenRole === 'tender_moderator') {
          const handleModeratorResult = await this.handleModeratorChangeState(
            request,
          );
        }

        return {
          entity: proposal,
          lastLog,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
