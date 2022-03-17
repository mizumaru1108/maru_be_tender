import { Test, TestingModule } from '@nestjs/testing';
import { FundraisingService } from './fundraising.service';

describe('FundraisingService', () => {
  let service: FundraisingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundraisingService],
    }).compile();

    service = module.get<FundraisingService>(FundraisingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
