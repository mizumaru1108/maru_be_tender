import { Test, TestingModule } from '@nestjs/testing';
import { TenderCommentsController } from './tender-comments.controller';
import { TenderCommentsService } from './tender-comments.service';

describe('TenderCommentsController', () => {
  let controller: TenderCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderCommentsController],
      providers: [TenderCommentsService],
    }).compile();

    controller = module.get<TenderCommentsController>(TenderCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
