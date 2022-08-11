import { Test, TestingModule } from '@nestjs/testing';
import { DynamicDonationService } from './dynamic-donation.service';

describe('DynamicDonationService', () => {
  let service: DynamicDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicDonationService],
    }).compile();

    service = module.get<DynamicDonationService>(DynamicDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
