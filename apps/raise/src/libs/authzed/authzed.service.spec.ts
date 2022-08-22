import { Test, TestingModule } from '@nestjs/testing';
import { AuthzedService } from './authzed.service';

describe('AuthzedService', () => {
  let service: AuthzedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthzedService],
    }).compile();

    service = module.get<AuthzedService>(AuthzedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
