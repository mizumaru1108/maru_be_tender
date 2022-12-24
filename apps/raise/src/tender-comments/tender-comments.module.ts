import { Module } from '@nestjs/common';
import { TenderCommentsController } from './controllers/tender-comments.controller';
import { TenderCommentsService } from './services/tender-comments.service';

@Module({
  controllers: [TenderCommentsController],
  providers: [TenderCommentsService],
})
export class TenderCommentsModule {}
