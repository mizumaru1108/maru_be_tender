import { Test, TestingModule } from '@nestjs/testing';
import { GsAuthController } from './gs-auth.controller';
import { GsAuthService } from '../services/gs-auth.service';

describe('GsAuthController', () => {
  let controller: GsAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GsAuthController],
      providers: [GsAuthService],
    }).compile();

    controller = module.get<GsAuthController>(GsAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
