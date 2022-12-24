import { Controller } from '@nestjs/common';
import { TenderCommentsService } from '../services/tender-comments.service';

@Controller('tender/comments')
export class TenderCommentsController {
  constructor(private readonly tenderCommentsService: TenderCommentsService) {}
}
