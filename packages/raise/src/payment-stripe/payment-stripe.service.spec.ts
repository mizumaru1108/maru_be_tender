import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStripeService } from './payment-stripe.service';

describe('PaymentStripeService', () => {
  let service: PaymentStripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentStripeService],
    }).compile();

    service = module.get<PaymentStripeService>(PaymentStripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
