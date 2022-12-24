import { Test, TestingModule } from '@nestjs/testing';
import { TenderMessagesController } from './tender-messages.controller';
import { TenderMessagesService } from '../tender-messages.service';

describe('TenderMessagesController', () => {
  let controller: TenderMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderMessagesController],
      providers: [TenderMessagesService],
    }).compile();

    controller = module.get<TenderMessagesController>(TenderMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
