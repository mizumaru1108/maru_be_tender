import { Module } from '@nestjs/common';
import { TenderProposalFlowsService } from './tender-proposal-flows.service';
import { TenderProposalFlowsController } from './tender-proposal-flows.controller';

@Module({
  controllers: [TenderProposalFlowsController],
  providers: [TenderProposalFlowsService]
})
export class TenderProposalFlowsModule {}
