import { Test, TestingModule } from '@nestjs/testing';
import { QuickDonationService } from './quick-donation.service';

describe('QuickDonationService', () => {
  let service: QuickDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuickDonationService],
    }).compile();

    service = module.get<QuickDonationService>(QuickDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
