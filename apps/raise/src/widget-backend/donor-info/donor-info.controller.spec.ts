import { Test, TestingModule } from '@nestjs/testing';
import { DonorInfoController } from './donor-info.controller';
import { DonorInfoService } from './donor-info.service';

describe('DonorInfoController', () => {
  let controller: DonorInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorInfoController],
      providers: [DonorInfoService],
    }).compile();

    controller = module.get<DonorInfoController>(DonorInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
