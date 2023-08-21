import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { request } from 'express';
import {
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import { ProposalAskedEditRequestEntity } from '../../../asked-edit-request/entities/proposal.asked.edit.request.entity';
import { AskAmandementRequestDto } from '../../dtos/requests';
import { CreateProposalAskedEditRequestMapper } from '../../mappers/create-proposal-asked-edit-request.mapper';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalAskedEditRequestRepository } from '../../../asked-edit-request/repositories/proposal.asked.edit.request.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProposalUpdateProps } from '../../types';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import {
  TenderAppRoleEnum,
  appRoleMappers,
} from '../../../../tender-commons/types';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { ProposalLogRepository } from '../../../proposal-log/repositories/proposal.log.repository';
import { nanoid } from 'nanoid';

export class AskAmandementRequestCommand {
  currentUser: TenderCurrentUser;
  request: AskAmandementRequestDto;
}

export class AskAmandementRequestCommandResult {
  data: ProposalAskedEditRequestEntity;
}

@CommandHandler(AskAmandementRequestCommand)
export class AskAmandementRequestCommandHandler
  implements
    ICommandHandler<
      AskAmandementRequestCommand,
      AskAmandementRequestCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly proposalAskedEditRequestRepo: ProposalAskedEditRequestRepository,
  ) {}

  async execute(
    command: AskAmandementRequestCommand,
  ): Promise<AskAmandementRequestCommandResult> {
    try {
      const { request, currentUser } = command;
      const proposal = await this.proposalRepo.fetchById({
        id: request.proposal_id,
      });
      if (!proposal) throw new DataNotFoundException('Proposal Not Found!');
      if (!proposal.supervisor_id) {
        throw new RequestErrorException(`Unable to fetch supervisor data!`);
      }

      if (proposal.outter_status === OutterStatusEnum.ON_REVISION) {
        throw new RequestErrorException(
          'Proposal aready asked for client to be revised!',
        );
      }

      if (
        proposal.outter_status === OutterStatusEnum.ASKED_FOR_AMANDEMENT ||
        proposal.outter_status === OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT
      ) {
        throw new RequestErrorException(
          'Proposal already asked to supervisor for an amandement to the user!',
        );
      }

      const proposalUpdatePayload = Builder<ProposalUpdateProps>(
        ProposalUpdateProps,
        {
          id: proposal.id,
        },
      ).build();

      if (currentUser.choosenRole === 'tender_finance') {
        proposalUpdatePayload.outter_status =
          OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT;
      } else {
        proposalUpdatePayload.outter_status =
          OutterStatusEnum.ASKED_FOR_AMANDEMENT;
      }

      const dbResult = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          await this.proposalRepo.update(proposalUpdatePayload, session);

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

          await this.logRepo.create({
            id: nanoid(),
            proposal_id: proposal.id,
            user_role: appRoleMappers[currentUser.choosenRole],
            reviewer_id: currentUser.id,
            action: ProposalAction.ASK_FOR_AMANDEMENT_REQUEST, //ask to supervisor for amandement request
            state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
            notes: request.notes,
            response_time: lastLog[0].created_at
              ? Math.round(
                  (new Date().getTime() - lastLog[0].created_at.getTime()) /
                    60000,
                )
              : null,
          });

          const createdAskedEditRequest =
            await this.proposalAskedEditRequestRepo.create(
              {
                id: uuidv4(),
                notes: request.notes,
                proposal_id: proposal.id,
                sender_id: currentUser.id,
                sender_role: appRoleMappers[currentUser.choosenRole],
                supervisor_id: proposal.supervisor_id!,
              },
              session,
            );

          console.log({ createdAskedEditRequest });
          return {
            created_asked_edit_request: createdAskedEditRequest,
          };
        },
        {
          timeout: 50000,
        },
      );

      return {
        data: dbResult.created_asked_edit_request,
      };
    } catch (error) {
      throw error;
    }
  }
}
