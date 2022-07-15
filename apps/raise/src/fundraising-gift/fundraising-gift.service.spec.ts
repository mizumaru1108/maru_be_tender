import { Test, TestingModule } from '@nestjs/testing';
import { FundraisingGiftService } from './fundraising-gift.service';

describe('FundraisingGiftService', () => {
  let service: FundraisingGiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundraisingGiftService],
    }).compile();

    service = module.get<FundraisingGiftService>(FundraisingGiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
