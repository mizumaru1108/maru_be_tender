import { ProposalPaymentEntity } from './proposal-payment.entity';

export class PaymentStatusEntity {
  id: string;
  payments?: ProposalPaymentEntity;
}
