import { Module } from '@nestjs/common';
import { TenderController } from './controllers/tender.controller';
import { TenderRepository } from './repositories/tender.repository';
import { TenderService } from './services/tender.service';

@Module({
  imports: [],
  providers: [TenderService, TenderRepository],
  controllers: [TenderController],
})
export class TenderModule {}
