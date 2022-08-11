import { Test, TestingModule } from '@nestjs/testing';
import { GiftDonationController } from './gift-donation.controller';
import { GiftDonationService } from './gift-donation.service';

describe('GiftDonationController', () => {
  let controller: GiftDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftDonationController],
      providers: [GiftDonationService],
    }).compile();

    controller = module.get<GiftDonationController>(GiftDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
