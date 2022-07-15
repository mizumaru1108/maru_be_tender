import { Test, TestingModule } from '@nestjs/testing';
import { PaymentXenditService } from './payment-xendit.service';

describe('PaymentXenditService', () => {
  let service: PaymentXenditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentXenditService],
    }).compile();

    service = module.get<PaymentXenditService>(PaymentXenditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
