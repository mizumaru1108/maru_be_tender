import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';
import { ChequeEntity } from './cheque.entity';
import { PaymentStatusEntity } from './payment-status.entity';

export class ProposalPaymentEntity {
  id: string;
  payment_amount?: number | null;
  proposal_id: string;
  payment_date?: Date | null;
  status?: string | null = 'SET_BY_SUPERVISOR';
  number_of_payments?: number | null;
  order?: number | null;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  cheques?: ChequeEntity[];
  proposal?: ProposalEntity;
  payment_status?: PaymentStatusEntity;
}
