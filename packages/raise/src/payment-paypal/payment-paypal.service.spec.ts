import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPaypalService } from './payment-paypal.service';

describe('PaymentPaypalService', () => {
  let service: PaymentPaypalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPaypalService],
    }).compile();

    service = module.get<PaymentPaypalService>(PaymentPaypalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
