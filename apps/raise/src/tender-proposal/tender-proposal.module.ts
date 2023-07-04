import { Module, Provider } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { TenderTrackModule } from '../tender-track/tender-track.module';
import { TenderProposalItemBudgetRepository } from './item-budget/repositories/proposal-item-budget.repository';
import { TenderProposalFollowUpController } from './tender-proposal-follow-up/controllers/tender-proposal-follow-up.controller';
import { TenderProposalFollowUpRepository } from './tender-proposal-follow-up/repositories/tender-proposal-follow-up.repository';
import { TenderProposalFollowUpService } from './tender-proposal-follow-up/services/tender-proposal-follow-up.service';
import { TenderProposalLogRepository } from './tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalLogService } from './tender-proposal-log/services/tender-proposal-log.service';
import { ProposalInsertPaymentCommandHandler } from './tender-proposal-payment/commands/proposal.insert.payments.command.ts/proposal.insert.payments.command';
import { ProposalUpdatePaymentCommandHandler } from './tender-proposal-payment/commands/proposal.update.payments.command.ts/proposal.update.payments.command';
import { TenderProposalPaymentController } from './tender-proposal-payment/controllers/tender-proposal-payment.controller';
import { TenderProposalChequeRepository } from './tender-proposal-payment/repositories/tender-proposal-cheque.repository';
import { TenderProposalPaymentRepository } from './tender-proposal-payment/repositories/tender-proposal-payment.repository';
import { TenderProposalPaymentService } from './tender-proposal-payment/services/tender-proposal-payment.service';
import { TenderProposalTimelineRepository } from './tender-proposal-timeline/repositories/tender-proposal-timeline.repository';
import { ChangeStateCommandHandler } from './tender-proposal/commands/change-state/change.state.command';
import { TenderProposalController } from './tender-proposal/controllers/tender-proposal.controller';
import { TenderProposalRepository } from './tender-proposal/repositories/tender-proposal.repository';
import { TenderProposalService } from './tender-proposal/services/tender-proposal.service';

const importedModules = [CqrsModule, TenderTrackModule];

const controllers = [
  /* Proposal */
  TenderProposalController,
  /* Payments */
  TenderProposalPaymentController,
  /* Follow Ups */
  TenderProposalFollowUpController,
];

const commands = [
  ChangeStateCommandHandler,
  /* Payments module */
  ProposalInsertPaymentCommandHandler,
  ProposalUpdatePaymentCommandHandler,
];

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
  /* Item budgets */
  TenderProposalItemBudgetRepository,
  /* Timeline */
  TenderProposalTimelineRepository,
  /* Cheque */
  TenderProposalChequeRepository,
];

const exportedServices: Provider[] = [
  TenderProposalRepository,
  TenderProposalLogRepository,
  TenderProposalItemBudgetRepository,
  TenderProposalTimelineRepository,
  TenderProposalChequeRepository,
];

@Module({
  imports: [...importedModules],
  controllers: [...controllers],
  providers: [...services, ...commands],
  exports: [...exportedServices],
})
export class TenderProposalModule {}
