import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import {
  CreateProposalPaymentDto,
  ProposalPaymentCreateDto,
} from '../dtos/requests/create-payment.dto';

export const CreateManyPaymentMapper = (request: CreateProposalPaymentDto) => {
  let totalAmount = 0;

  const payloads = request.payments.map((payload: ProposalPaymentCreateDto) => {
    const payment: Prisma.paymentCreateManyInput = {
      id: nanoid(),
      order: payload.order,
      payment_amount: payload.payment_amount,
      payment_date: new Date(payload.payment_date),
      proposal_id: request.proposal_id,
      status: 'SET_BY_SUPERVISOR',
    };
    totalAmount += payload.payment_amount;
    return payment;
  });

  return {
    totalAmount,
    payloads,
  };
};
