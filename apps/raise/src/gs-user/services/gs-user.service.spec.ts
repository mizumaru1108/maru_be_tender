import { Test, TestingModule } from '@nestjs/testing';
import { GsUserService } from './gs-user.service';

describe('GsUserService', () => {
  let service: GsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GsUserService],
    }).compile();

    service = module.get<GsUserService>(GsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
