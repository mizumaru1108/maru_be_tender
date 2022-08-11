import { Test, TestingModule } from '@nestjs/testing';
import { UnitDonationController } from './unit-donation.controller';
import { UnitDonationService } from './unit-donation.service';

describe('UnitDonationController', () => {
  let controller: UnitDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDonationController],
      providers: [UnitDonationService],
    }).compile();

    controller = module.get<UnitDonationController>(UnitDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
