import { Test, TestingModule } from '@nestjs/testing';
import { QuickDonationController } from './quick-donation.controller';
import { QuickDonationService } from './quick-donation.service';

describe('QuickDonationController', () => {
  let controller: QuickDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickDonationController],
      providers: [QuickDonationService],
    }).compile();

    controller = module.get<QuickDonationController>(QuickDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
