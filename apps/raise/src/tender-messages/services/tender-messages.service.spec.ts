import { Test, TestingModule } from '@nestjs/testing';
import { TenderMessagesService } from './tender-messages.service';

describe('TenderMessagesService', () => {
  let service: TenderMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderMessagesService],
    }).compile();

    service = module.get<TenderMessagesService>(TenderMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
