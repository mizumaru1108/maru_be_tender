import { Injectable } from '@nestjs/common';
import { TenderProposalLogRepository } from '../repositories/tender-proposal-log.repository';

@Injectable()
export class TenderProposalLogService {
  constructor(
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
  ) {}
}
