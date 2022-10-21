import { Test, TestingModule } from '@nestjs/testing';
import { TenderProposalFlowsController } from './tender-proposal-flows.controller';
import { TenderProposalFlowsService } from './tender-proposal-flows.service';

describe('TenderProposalFlowsController', () => {
  let controller: TenderProposalFlowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderProposalFlowsController],
      providers: [TenderProposalFlowsService],
    }).compile();

    controller = module.get<TenderProposalFlowsController>(TenderProposalFlowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
