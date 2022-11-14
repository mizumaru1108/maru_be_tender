import { Module } from '@nestjs/common';
import { TenderEmailController } from './controllers/tender-email.controller';
import { TenderEmailRepository } from './repositories/tender-email.repository';
import { TenderEmailService } from './services/tender-email.service';

@Module({
  controllers: [TenderEmailController],
  providers: [TenderEmailService, TenderEmailRepository],
  exports: [TenderEmailService],
})
export class TenderEmailModule {}
