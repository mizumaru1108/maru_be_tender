import { Test, TestingModule } from '@nestjs/testing';
import { WidgetBackendService } from './widget-backend.service';

describe('WidgetBackendService', () => {
  let service: WidgetBackendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetBackendService],
    }).compile();

    service = module.get<WidgetBackendService>(WidgetBackendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
