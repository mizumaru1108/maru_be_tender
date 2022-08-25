import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPaytabsController } from './payment-paytabs.controller';

describe('PaymentPaytabsController', () => {
  let controller: PaymentPaytabsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPaytabsController],
    }).compile();

    controller = module.get<PaymentPaytabsController>(PaymentPaytabsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
