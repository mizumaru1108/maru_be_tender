import { Module } from '@nestjs/common';
import { TenderEmailController } from './controllers/tender-email.controller';
import { TenderEmailService } from './services/tender-email.service';

@Module({
  controllers: [TenderEmailController],
  providers: [TenderEmailService],
})
export class TenderEmailModule {}
