import { ProposalPaymentEntity } from './proposal-payment.entity';

export class ChequeEntity {
  id: string;
  payment_id: string;
  deposit_date: Date;
  number: string;
  transfer_receipt: any; // json
  payment?: ProposalPaymentEntity;
}
