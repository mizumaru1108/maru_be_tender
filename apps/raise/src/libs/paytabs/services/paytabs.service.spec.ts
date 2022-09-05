import { Test, TestingModule } from '@nestjs/testing';
import { PaytabsService } from './paytabs.service';

describe('PaytabsService', () => {
  let service: PaytabsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaytabsService],
    }).compile();

    service = module.get<PaytabsService>(PaytabsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
s;
