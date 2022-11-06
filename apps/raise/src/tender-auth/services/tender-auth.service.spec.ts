import { Test, TestingModule } from '@nestjs/testing';
import { TenderAuthService } from './tender-auth.service';

describe('TenderAuthService', () => {
  let service: TenderAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderAuthService],
    }).compile();

    service = module.get<TenderAuthService>(TenderAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
