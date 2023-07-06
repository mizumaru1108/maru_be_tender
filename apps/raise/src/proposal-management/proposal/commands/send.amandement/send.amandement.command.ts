import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProposalEntity } from '../../entities/proposal.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { request } from 'express';
import { MsegatSendingMessageError } from '../../../../libs/msegat/exceptions/send.message.error.exceptions';
import { OutterStatusEnum } from '../../../../tender-commons/types/proposal';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import { SendAmandementDto } from '../../dtos/requests';
import { ProposalUpdateRequestMapper } from '../../mappers/proposal-update-request.mapper';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { Builder } from 'builder-pattern';
import { UpdateProposalProps } from '../../types';

export class SendAmandementCommand {
  currentUser: TenderCurrentUser;
  request: SendAmandementDto;
}

export class SendAmandementCommandResult {
  proposal: ProposalEntity;
}

@CommandHandler(SendAmandementCommand)
export class SendAmandementCommandHandler
  implements
    ICommandHandler<SendAmandementCommand, SendAmandementCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
  ) {}
  async execute(command: SendAmandementCommand): Promise<any> {
    const { currentUser, request } = command;
    const { proposal_id } = request;
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        /* object atleas has id, and one more payload (notes), if not then throw err */
        if (Object.keys(request).length < 2) {
          throw new PayloadErrorException('Give at least one revision!');
        }

        const proposal = await this.proposalRepo.fetchById(
          { id: proposal_id },
          session,
        );
        if (!proposal) {
          throw new DataNotFoundException('Proposal Not Found!');
        }

        if (proposal.outter_status === OutterStatusEnum.ON_REVISION) {
          throw new RequestErrorException(
            'Unprocessable, You cant send amandement that already on revision',
          );
        }

        // const createProposalEditRequestPayload = ProposalUpdateRequestMapper(
        //   proposal,
        //   userId,
        //   request,
        // );

        // const proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {
        //   supervisor_id: userId,
        //   outter_status: OutterStatusEnum.ON_REVISION,
        // };

        const proposalUpdateProps = Builder<UpdateProposalProps>(
          UpdateProposalProps,
          {
            supervisor_id: currentUser.id,
            outter_status: OutterStatusEnum.ON_REVISION,
          },
        ).build();

        //     const sendAmandementResult = await this.proposalRepo.sendAmandement(
        //       proposal_id,
        //       userId,
        //       proposalUpdatePayload,
        //       createProposalEditRequestPayload,
        //       request.notes,
        //       request.selectLang,
        //       );

        //       await this.notificationService.sendSmsAndEmailBatch(
        //         sendAmandementResult.sendAmandementNotif,
        //         );

        //         return {
        //           proposal: sendAmandementResult.updatedProposal;
        //         }
      });
    } catch (error) {
      if (error instanceof MsegatSendingMessageError) {
        throw new BadRequestException(
          `Request might be success but sms notif may not be sented to the client details ${error.message}`,
        );
      }
      throw error;
    }
  }
}
