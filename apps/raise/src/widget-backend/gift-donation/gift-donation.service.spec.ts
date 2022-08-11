import { Test, TestingModule } from '@nestjs/testing';
import { GiftDonationService } from './gift-donation.service';

describe('GiftDonationService', () => {
  let service: GiftDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftDonationService],
    }).compile();

    service = module.get<GiftDonationService>(GiftDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
