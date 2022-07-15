import { Test, TestingModule } from '@nestjs/testing';
import { PaymentAmazonpsController } from './payment-amazonps.controller';

describe('PaymentAmazonpsController', () => {
  let controller: PaymentAmazonpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentAmazonpsController],
    }).compile();

    controller = module.get<PaymentAmazonpsController>(PaymentAmazonpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
