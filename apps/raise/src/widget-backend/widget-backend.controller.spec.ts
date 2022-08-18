import { Test, TestingModule } from '@nestjs/testing';
import { WidgetBackendController } from './widget-backend.controller';
import { WidgetBackendService } from './widget-backend.service';

describe('WidgetBackendController', () => {
  let controller: WidgetBackendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetBackendController],
      providers: [WidgetBackendService],
    }).compile();

    controller = module.get<WidgetBackendController>(WidgetBackendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
