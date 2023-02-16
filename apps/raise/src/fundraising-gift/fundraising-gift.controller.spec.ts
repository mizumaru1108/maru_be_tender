import { Test, TestingModule } from '@nestjs/testing';
import { FundraisingGiftController } from './fundraising-gift.controller';

describe('FundraisingGiftController', () => {
  let controller: FundraisingGiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundraisingGiftController],
    }).compile();

    controller = module.get<FundraisingGiftController>(
      FundraisingGiftController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
