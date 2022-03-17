import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPaypalController } from './payment-paypal.controller';

describe('PaymentPaypalController', () => {
  let controller: PaymentPaypalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPaypalController],
    }).compile();

    controller = module.get<PaymentPaypalController>(PaymentPaypalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
