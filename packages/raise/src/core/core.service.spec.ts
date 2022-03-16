import { Test, TestingModule } from '@nestjs/testing';
import { CoreService } from './core.service';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreService],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have Hello World', () => {
    expect(service.getHello()).toMatchObject({
      success: true,
      status: 200,
      message: 'Hello World!',
    });
  });
});
