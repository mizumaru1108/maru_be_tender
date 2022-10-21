import { Test, TestingModule } from '@nestjs/testing';
import { TenderProposalFlowsService } from './tender-proposal-flows.service';

describe('TenderProposalFlowsService', () => {
  let service: TenderProposalFlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderProposalFlowsService],
    }).compile();

    service = module.get<TenderProposalFlowsService>(TenderProposalFlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
