import { Module } from '@nestjs/common';
import { TenderController } from './controllers/tender.controller';
import { TenderService } from './services/tender.service';

@Module({
  imports: [],
  providers: [TenderService],
  controllers: [TenderController],
})
export class TenderModule {}
