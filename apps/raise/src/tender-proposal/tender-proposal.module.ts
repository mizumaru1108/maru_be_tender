import { Module } from '@nestjs/common';
import { TenderProposalService } from './tender-proposal.service';
import { TenderProposalController } from './tender-proposal.controller';

@Module({
  controllers: [TenderProposalController],
  providers: [TenderProposalService]
})
export class TenderProposalModule {}
