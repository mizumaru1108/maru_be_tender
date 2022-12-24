import { Test, TestingModule } from '@nestjs/testing';
import { TenderCommentsService } from './tender-comments.service';

describe('TenderCommentsService', () => {
  let service: TenderCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderCommentsService],
    }).compile();

    service = module.get<TenderCommentsService>(TenderCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
