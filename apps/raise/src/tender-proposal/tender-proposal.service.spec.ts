import { Test, TestingModule } from '@nestjs/testing';
import { TenderProposalService } from './tender-proposal.service';

describe('TenderProposalService', () => {
  let service: TenderProposalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderProposalService],
    }).compile();

    service = module.get<TenderProposalService>(TenderProposalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
