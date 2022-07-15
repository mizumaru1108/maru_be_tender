import { Test, TestingModule } from '@nestjs/testing';
import { PaymentAmazonpsService } from './payment-amazonps.service';

describe('PaymentAmazonpsService', () => {
  let service: PaymentAmazonpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentAmazonpsService],
    }).compile();

    service = module.get<PaymentAmazonpsService>(PaymentAmazonpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
