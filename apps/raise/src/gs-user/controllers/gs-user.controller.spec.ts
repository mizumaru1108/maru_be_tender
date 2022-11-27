import { Test, TestingModule } from '@nestjs/testing';
import { GsUserService } from '../services/gs-user.service';
import { GsUserController } from './gs-user.controller';

describe('GsUserController', () => {
  let controller: GsUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GsUserController],
      providers: [GsUserService],
    }).compile();

    controller = module.get<GsUserController>(GsUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
