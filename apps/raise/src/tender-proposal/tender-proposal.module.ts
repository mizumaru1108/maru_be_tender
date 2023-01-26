import { Module } from '@nestjs/common';
import { TenderUserModule } from '../tender-user/tender-user.module';

import { TenderProposalController } from './tender-proposal/controllers/tender-proposal.controller';
import { TenderProposalLogRepository } from './tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalPaymentRepository } from './proposal-payment/repositories/tender-proposal-payment.repository';
import { TenderProposalRepository } from './tender-proposal/repositories/tender-proposal.repository';
import { TenderProposalLogService } from './tender-proposal-log/services/tender-proposal-log.service';
import { TenderProposalPaymentService } from './proposal-payment/services/tender-proposal-payment.service';
import { TenderProposalService } from './tender-proposal/services/tender-proposal.service';
import { TenderProposalFollowUpService } from './tender-proposal-follow-up/services/tender-proposal-follow-up.service';
import { TenderProposalFollowUpRepository } from './tender-proposal-follow-up/repositories/tender-proposal-follow-up.repository';
import { TenderProposalFollowUpController } from './tender-proposal-follow-up/controllers/tender-proposal-follow-up.controller';
import { TenderProposalPaymentController } from './proposal-payment/controllers/tender-proposal-payment.controller';

@Module({
  controllers: [
    /* Proposal */
    TenderProposalController,
    /* Payments */
    TenderProposalPaymentController,
    /* Follow Ups */
    TenderProposalFollowUpController,
  ],
  providers: [
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
  ],
})
export class TenderProposalModule {}
