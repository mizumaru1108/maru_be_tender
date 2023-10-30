import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProposalPaymentCreateDto } from '../../dtos/requests';
import { ProposalRepository } from '../../../proposal/repositories/proposal.repository';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { InvalidNumberofPaymentsException } from '../../exceptions/invalid.number.of.payments.exception';
import {
  CreateProposalLogProps,
  ProposalLogRepository,
} from '../../../proposal-log/repositories/proposal.log.repository';
import {
  CreatePaymentProps,
  ProposalPaymentRepository,
} from '../../repositories/proposal-payment.repository';
import { nanoid } from 'nanoid';
import { InvalidAmountOfSupportException } from '../../exceptions/invalid.amount.of.support.exception';
import { ProposalUpdateProps } from '../../../proposal/types';
import { Builder } from 'builder-pattern';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import { ProposalEntity } from 'src/proposal-management/proposal/entities/proposal.entity';

export class ProposalInsertPaymentCommand {
  currentUserId: string;
  proposal_id: string;
  payments: ProposalPaymentCreateDto[];
}

export class ProposalInsertPaymentCommandResult {
  updated_proposal: ProposalEntity;
}

@CommandHandler(ProposalInsertPaymentCommand)
export class ProposalInsertPaymentCommandHandler
  implements
    ICommandHandler<
      ProposalInsertPaymentCommand,
      ProposalInsertPaymentCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly paymentRepo: ProposalPaymentRepository,
  ) {}

  async execute(
    command: ProposalInsertPaymentCommand,
  ): Promise<ProposalInsertPaymentCommandResult> {
    const { currentUserId, proposal_id, payments } = command;
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const proposal = await this.proposalRepo.fetchById(
          {
            id: proposal_id,
          },
          session,
        );
        if (!proposal) {
          throw new DataNotFoundException(
            `Proposal with id of ${proposal_id} not found`,
          );
        }

        if (currentUserId !== proposal.supervisor_id) {
          throw new ForbiddenPermissionException(
            'You are not the responsible supervisor of this proposal!',
          );
        }

        if (!proposal.fsupport_by_supervisor) {
          throw new PayloadErrorException('Amount for support is not defined!');
        }

        if (!proposal.number_of_payments_by_supervisor) {
          throw new PayloadErrorException(
            'Proposal number of payments is not set!',
          );
        }

        // validate the length of the payment
        if (
          payments.length !== Number(proposal.number_of_payments_by_supervisor)
        ) {
          throw new InvalidNumberofPaymentsException();
        }

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

        let totalAmount = 0;
        const manyPaymentProps = payments.map(
          (payload: ProposalPaymentCreateDto) => {
            const payment: CreatePaymentProps = {
              id: nanoid(),
              order: payload.order.toString(),
              payment_amount: payload.payment_amount.toFixed(2).toString(),
              payment_date: new Date(payload.payment_date),
              proposal_id: proposal_id,
              notes: payload.notes,
              status: 'set_by_supervisor',
            };
            totalAmount += payload.payment_amount;
            return payment;
          },
        );

        if (Number(proposal.fsupport_by_supervisor) !== totalAmount) {
          throw new InvalidAmountOfSupportException();
        }

        // create the payment
        await this.paymentRepo.createMany(manyPaymentProps, session);

        const createLogPayloads: CreateProposalLogProps =
          Builder<CreateProposalLogProps>(CreateProposalLogProps, {
            id: nanoid(),
            proposal_id: proposal.id,
            action: ProposalAction.INSERT_PAYMENT,
            reviewer_id: currentUserId,
            state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
            user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
            response_time: lastLog[0].created_at
              ? Math.round(
                  (new Date().getTime() - lastLog[0].created_at.getTime()) /
                    60000,
                )
              : null,
          }).build();
        // set payment / insert payment
        await this.logRepo.create(createLogPayloads, session);

        const updateProposalPayloads: ProposalUpdateProps =
          Builder<ProposalUpdateProps>(ProposalUpdateProps, {
            id: proposal.id,
            inner_status:
              InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
            outter_status: OutterStatusEnum.ONGOING,
            state: TenderAppRoleEnum.PROJECT_MANAGER,
          }).build();

        // update the proposal
        const updatedProposal = await this.proposalRepo.update(
          updateProposalPayloads,
          session,
        );

        return {
          updated_proposal: updatedProposal,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
