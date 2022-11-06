import { Test, TestingModule } from '@nestjs/testing';
import { TenderAuthService } from '../services/tender-auth.service';
import { TenderAuthController } from './tender-auth.controller';

describe('TenderAuthController', () => {
  let controller: TenderAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderAuthController],
      providers: [TenderAuthService],
    }).compile();

    controller = module.get<TenderAuthController>(TenderAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
