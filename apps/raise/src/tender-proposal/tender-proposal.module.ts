import { Module } from '@nestjs/common';

import { TenderProposalController } from './controllers/tender-proposal.controller';
import { TenderProposalFlowRepository } from './repositories/tender-proposal-flow.repository';
import { TenderProposalLogRepository } from './repositories/tender-proposal-log.repository';
import { TenderProposalRepository } from './repositories/tender-proposal.repository';
import { TenderProposalFlowService } from './services/tender-proposal-flow.service';
import { TenderProposalLogService } from './services/tender-proposal-log.service';
import { TenderProposalService } from './services/tender-proposal.service';

@Module({
  controllers: [TenderProposalController],
  providers: [
    TenderProposalService,
    TenderProposalRepository,
    TenderProposalLogService,
    TenderProposalLogRepository,
    TenderProposalFlowService,
    TenderProposalFlowRepository,
  ],
})
export class TenderProposalModule {}
