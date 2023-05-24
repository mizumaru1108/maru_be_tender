import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPaytabsService } from './payment-paytabs.service';

describe('PaymentPaytabsService', () => {
  let service: PaymentPaytabsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPaytabsService],
    }).compile();

    service = module.get<PaymentPaytabsService>(PaymentPaytabsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
