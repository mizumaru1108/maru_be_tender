import { Test, TestingModule } from '@nestjs/testing';
import { DonorInfoService } from './donor-info.service';

describe('DonorInfoService', () => {
  let service: DonorInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonorInfoService],
    }).compile();

    service = module.get<DonorInfoService>(DonorInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
