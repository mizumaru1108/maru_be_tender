import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, proposal } from '@prisma/client';
import { nanoid } from 'nanoid';
import { actionValidator } from '../../../tender-commons/utils/action-validator';
import { ownershipErrorThrow } from '../../../tender-commons/utils/proposal-ownership-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { UpdatePaymentResponseDto } from '../dtos/responses/update-payment-response.dto';
import { TenderProposalPaymentRepository } from '../repositories/tender-proposal-payment.repository';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import { CreateProposalPaymentDto } from '../dtos/requests/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/requests/update-payment.dto';
import {
  InnerStatusEnum,
  OutterStatusEnum,
} from '../../../tender-commons/types/proposal';
import { CreateManyPaymentMapper } from '../mappers/create-many-payment.mapper';

@Injectable()
export class TenderProposalPaymentService {
  constructor(
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly tenderProposalPaymentRepository: TenderProposalPaymentRepository,
  ) {}

  async insertPayment(
    currentUserId: string,
    request: CreateProposalPaymentDto,
  ): Promise<proposal> {
    const { payments, proposal_id } = request;

    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (currentUserId !== proposal.supervisor_id) {
      throw new ForbiddenException(
        'You are not the responsible supervisor of this proposal!',
      );
    }

    if (!proposal.fsupport_by_supervisor) {
      throw new BadRequestException('Amount for support is not defined!');
    }

    if (!proposal.number_of_payments) {
      throw new BadRequestException('Proposal number of payments is not set!');
    }

    // validate the length of the payment
    if (payments.length !== Number(proposal.number_of_payments)) {
      throw new BadRequestException(
        'Number of payment is not equal to the defined payment on proposal!',
      );
    }

    const mapResult = CreateManyPaymentMapper(request);

    if (Number(proposal.fsupport_by_supervisor) !== mapResult.totalAmount) {
      throw new BadRequestException(
        'Amount required for support is not the same as the payload amount!',
      );
    }

    const createPaymentPayload: Prisma.paymentCreateManyInput[] =
      mapResult.payloads;

    const proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {
      inner_status: InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
      outter_status: OutterStatusEnum.ONGOING,
      state: TenderAppRoleEnum.PROJECT_MANAGER,
    };

    // create the payment
    const updatedProposal =
      await this.tenderProposalPaymentRepository.insertPayment(
        proposal_id,
        proposalUpdatePayload,
        createPaymentPayload,
      );

    return updatedProposal;
  }

  async updatePayment(
    currentUser: TenderCurrentUser,
    request: UpdatePaymentDto,
  ): Promise<UpdatePaymentResponseDto> {
    const { id: userId, choosenRole } = currentUser;
    const { payment_id, action, cheque } = request;

    const payment = await this.tenderProposalPaymentRepository.findPaymentById(
      payment_id,
    );
    if (!payment) throw new NotFoundException('Payment not found');

    const proposal = await this.tenderProposalRepository.fetchProposalById(
      payment.proposal_id,
    );
    if (!proposal) {
      throw new NotFoundException('No proposal data found on this payment');
    }

    let status:
      | 'SET_BY_SUPERVISOR'
      | 'ISSUED_BY_SUPERVISOR'
      | 'ACCEPTED_BY_PROJECT_MANAGER'
      | 'ACCEPTED_BY_FINANCE'
      | 'DONE'
      | null = null;

    let chequeData: Prisma.chequeCreateInput | null = null;

    if (choosenRole === 'tender_project_manager') {
      if (proposal.project_manager_id !== userId) ownershipErrorThrow();
      actionValidator(['accept', 'reject'], action);
      if (action === 'accept') status = 'ACCEPTED_BY_PROJECT_MANAGER';
      if (action === 'reject') status = 'SET_BY_SUPERVISOR';
    }

    if (choosenRole === 'tender_finance') {
      if (proposal.finance_id !== userId) ownershipErrorThrow();
      actionValidator(['accept'], action);
      if (action === 'accept') status = 'ACCEPTED_BY_FINANCE';
      // !TODO: if (action is edit) do something, still abmigous, need to discuss.
    }

    if (choosenRole === 'tender_project_supervisor') {
      if (proposal.supervisor_id !== userId) ownershipErrorThrow();
      actionValidator(['issue'], action);
      if (action === 'issue') status = 'ISSUED_BY_SUPERVISOR';
    }

    if (choosenRole === 'tender_cashier') {
      if (proposal.cashier_id !== userId) ownershipErrorThrow();
      actionValidator(['upload_receipt'], action);
      if (!cheque) throw new BadRequestException('Cheque data is required!');
      if (action === 'upload_receipt') status = 'DONE';
      chequeData = {
        id: nanoid(),
        deposit_date: cheque.deposit_date,
        number: cheque.number,
        transfer_receipt: {
          url: cheque.transfer_receipt.url,
          size: cheque.transfer_receipt.size,
          type: cheque.transfer_receipt.type,
        },
        payment: {
          connect: {
            id: payment_id,
          },
        },
      };
    }

    const response = await this.tenderProposalPaymentRepository.updatePayment(
      payment_id,
      status,
      currentUser.id,
      appRoleMappers[choosenRole] as TenderAppRole,
      chequeData,
    );

    return {
      updatedPayment: response.payment,
      createdCheque: response.cheque,
      createdLogs: response.logs,
    };
  }
}
