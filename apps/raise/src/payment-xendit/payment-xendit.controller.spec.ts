import { Test, TestingModule } from '@nestjs/testing';
import { PaymentXenditController } from './payment-xendit.controller';

describe('PaymentXenditController', () => {
  let controller: PaymentXenditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentXenditController],
    }).compile();

    controller = module.get<PaymentXenditController>(PaymentXenditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
