import { Test, TestingModule } from '@nestjs/testing';
import { TenderEmailService } from '../services/tender-email.service';
import { TenderEmailController } from './tender-email.controller';

describe('TenderEmailController', () => {
  let controller: TenderEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderEmailController],
      providers: [TenderEmailService],
    }).compile();

    controller = module.get<TenderEmailController>(TenderEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
