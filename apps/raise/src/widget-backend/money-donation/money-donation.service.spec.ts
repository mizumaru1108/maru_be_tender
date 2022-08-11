import { Test, TestingModule } from '@nestjs/testing';
import { MoneyDonationService } from './money-donation.service';

describe('MoneyDonationService', () => {
  let service: MoneyDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoneyDonationService],
    }).compile();

    service = module.get<MoneyDonationService>(MoneyDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
