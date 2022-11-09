import { Test, TestingModule } from '@nestjs/testing';
import { TenderEmailService } from './tender-email.service';

describe('TenderEmailService', () => {
  let service: TenderEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderEmailService],
    }).compile();

    service = module.get<TenderEmailService>(TenderEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
