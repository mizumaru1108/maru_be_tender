import { Test, TestingModule } from '@nestjs/testing';
import { TenderNotificationService } from '../services/tender-notification.service';
import { TenderNotificationController } from './tender-notification.controller';

describe('TenderNotificationController', () => {
  let controller: TenderNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderNotificationController],
      providers: [TenderNotificationService],
    }).compile();

    controller = module.get<TenderNotificationController>(
      TenderNotificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
