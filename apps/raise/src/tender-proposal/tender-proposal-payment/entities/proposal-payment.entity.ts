import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';
import { ChequeEntity } from './cheque.entity';
import { PaymentStatusEntity } from './payment-status.entity';

export class ProposalPaymentEntity {
  id: string;
  payment_amount: number;
  proposal_id: string;
  payment_date?: Date;
  status: string = 'SET_BY_SUPERVISOR';
  number_of_payments?: number;
  order?: number;
  created_at?: Date = new Date();
  updated_at?: Date = new Date();
  cheques: ChequeEntity[];
  proposal: ProposalEntity;
  payment_status: PaymentStatusEntity;
}
