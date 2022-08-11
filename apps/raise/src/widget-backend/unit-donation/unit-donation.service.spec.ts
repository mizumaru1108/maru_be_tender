import { Test, TestingModule } from '@nestjs/testing';
import { UnitDonationService } from './unit-donation.service';

describe('UnitDonationService', () => {
  let service: UnitDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitDonationService],
    }).compile();

    service = module.get<UnitDonationService>(UnitDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
