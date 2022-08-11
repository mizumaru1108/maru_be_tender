import { Test, TestingModule } from '@nestjs/testing';
import { DynamicDonationController } from './dynamic-donation.controller';
import { DynamicDonationService } from './dynamic-donation.service';

describe('DynamicDonationController', () => {
  let controller: DynamicDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicDonationController],
      providers: [DynamicDonationService],
    }).compile();

    controller = module.get<DynamicDonationController>(DynamicDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
