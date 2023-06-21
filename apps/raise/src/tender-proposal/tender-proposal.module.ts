import { Module, Provider } from '@nestjs/common';

import { TenderProposalFollowUpController } from './tender-proposal-follow-up/controllers/tender-proposal-follow-up.controller';
import { TenderProposalFollowUpRepository } from './tender-proposal-follow-up/repositories/tender-proposal-follow-up.repository';
import { TenderProposalFollowUpService } from './tender-proposal-follow-up/services/tender-proposal-follow-up.service';
import { TenderProposalLogRepository } from './tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalLogService } from './tender-proposal-log/services/tender-proposal-log.service';
import { TenderProposalPaymentController } from './tender-proposal-payment/controllers/tender-proposal-payment.controller';
import { TenderProposalPaymentRepository } from './tender-proposal-payment/repositories/tender-proposal-payment.repository';
import { TenderProposalPaymentService } from './tender-proposal-payment/services/tender-proposal-payment.service';
import { TenderProposalController } from './tender-proposal/controllers/tender-proposal.controller';
import { TenderProposalRepository } from './tender-proposal/repositories/tender-proposal.repository';
import { TenderProposalService } from './tender-proposal/services/tender-proposal.service';
import { TenderProposalBeneficiariesController } from './tender-proposal-beneficiaries/controllers/tender-proposal-beneficiaries.controller';
import { TenderProposalBeneficiaresService } from './tender-proposal-beneficiaries/services/tender-proposal-beneficiaries.service';
import { TenderProposalBeneficiariesRepository } from './tender-proposal-beneficiaries/repositories/tender-proposal-beneficiaries.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { ChangeStateCommandHandler } from './tender-proposal/commands/change-state/change.state.command';

const controllers = [
  /* Proposal */
  TenderProposalController,
  /* Payments */
  TenderProposalPaymentController,
  /* Follow Ups */
  TenderProposalFollowUpController,
  /* Beneficiaries */
  TenderProposalBeneficiariesController,
];

const commands = [ChangeStateCommandHandler];

// const repositories = [
//   {
//     provide: TenderProposalRepository.name,
//     useClass: TenderProposalRepository,
//   },
// ];

const services: Provider[] = [
  /* Proposal */
  TenderProposalService,
  TenderProposalRepository,
  /* payments */
  TenderProposalPaymentService,
  TenderProposalPaymentRepository,
  /* Logs */
  TenderProposalLogService,
  TenderProposalLogRepository,
  /* Follow Ups */
  TenderProposalFollowUpService,
  TenderProposalFollowUpRepository,
  /* Beneficiaries */
  TenderProposalBeneficiaresService,
  TenderProposalBeneficiariesRepository,
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...services, ...commands],
})
export class TenderProposalModule {}
