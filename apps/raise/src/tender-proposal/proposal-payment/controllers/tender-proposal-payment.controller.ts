import { Controller } from '@nestjs/common';
import { TenderProposalFollowUpService } from '../../tender-proposal-follow-up/services/tender-proposal-follow-up.service';

@Controller('tender/proposal/payment')
export class TenderProposalPaymentController {
  constructor(
    private readonly followUpService: TenderProposalFollowUpService,
  ) {}
}
