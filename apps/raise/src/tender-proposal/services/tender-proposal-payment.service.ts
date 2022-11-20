import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { CreateProposalPaymentDto } from '../dtos/requests/payment/create-payment.dto';
import { TenderProposalPaymentRepository } from '../repositories/tender-proposal-payment.repository';
import { TenderProposalRepository } from '../repositories/tender-proposal.repository';

@Injectable()
export class TenderProposalPaymentService {
  constructor(
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly tenderProposalPaymentRepository: TenderProposalPaymentRepository,
  ) {}

  async insertPayment(
    currentUserId: string,
    request: CreateProposalPaymentDto,
  ): Promise<Prisma.paymentCreateManyInput[]> {
    const { payments, proposal_id } = request;

    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (currentUserId !== proposal.supervisor_id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );
    }

    if (!proposal.number_of_payments) {
      throw new BadRequestException('Proposal number of payments is not set');
    }

    // validate the length of the payment
    if (payments.length !== Number(proposal.number_of_payments)) {
      throw new BadRequestException(
        'Number of payment is not equal to the defined payment on proposal',
      );
    }

    // map the payment
    const createPaymentPayload: Prisma.paymentCreateManyArgs = {
      data: payments.map((payment) => ({
        id: nanoid(),
        order: payment.order,
        payment_amount: payment.payment_amount,
        payment_date: new Date(payment.payment_date),
        proposal_id,
        status: 'SET_BY_SUPERVISOR',
      })),
    };

    // create the payment
    await this.tenderProposalPaymentRepository.createManyPayment(
      createPaymentPayload,
    );

    return createPaymentPayload.data as Prisma.paymentCreateManyInput[];
  }
}
