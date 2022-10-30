import { Module } from '@nestjs/common';

import { TenderProposalController } from './controllers/tender-proposal.controller';
import { TenderProposalFlowService } from './services/tender-proposal-flow.service';
import { TenderProposalLogService } from './services/tender-proposal-log.service';
import { TenderProposalService } from './services/tender-proposal.service';

@Module({
  controllers: [TenderProposalController],
  providers: [
    TenderProposalService,
    TenderProposalLogService,
    TenderProposalFlowService,
  ],
})
export class TenderProposalModule {}
