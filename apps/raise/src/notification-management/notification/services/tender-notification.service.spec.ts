import { Test, TestingModule } from '@nestjs/testing';
import { TenderNotificationService } from './tender-notification.service';

describe('TenderNotificationService', () => {
  let service: TenderNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderNotificationService],
    }).compile();

    service = module.get<TenderNotificationService>(TenderNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
