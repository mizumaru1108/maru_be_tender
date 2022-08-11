import { Test, TestingModule } from '@nestjs/testing';
import { MoneyDonationController } from './money-donation.controller';
import { MoneyDonationService } from './money-donation.service';

describe('MoneyDonationController', () => {
  let controller: MoneyDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyDonationController],
      providers: [MoneyDonationService],
    }).compile();

    controller = module.get<MoneyDonationController>(MoneyDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
