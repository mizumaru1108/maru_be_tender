import { Module } from '@nestjs/common';

import { TenderClientController } from './controllers/tender-client.controller';
import { TenderClientService } from './services/tender-client.service';

@Module({
  controllers: [TenderClientController],
  providers: [TenderClientService],
  exports: [TenderClientService],
})
export class TenderClientModule {}
