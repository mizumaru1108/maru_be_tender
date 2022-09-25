import { Module } from '@nestjs/common';
import { TenderController } from './tender.controller';
import { TenderService } from './tender.service';

@Module({
  imports: [],
  providers: [TenderService],
  controllers: [TenderController],
})
export class TenderModule { }
