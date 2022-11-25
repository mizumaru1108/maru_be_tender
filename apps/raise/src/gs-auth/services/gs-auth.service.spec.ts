import { Test, TestingModule } from '@nestjs/testing';
import { GsAuthService } from './gs-auth.service';

describe('GsAuthService', () => {
  let service: GsAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GsAuthService],
    }).compile();

    service = module.get<GsAuthService>(GsAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
