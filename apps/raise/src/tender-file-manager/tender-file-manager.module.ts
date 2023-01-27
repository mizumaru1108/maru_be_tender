import { Global, Module } from '@nestjs/common';
import { TenderFileManagerService } from './services/tender-file-manager.service';
import { TenderFileManagerController } from './controllers/tender-file-manager.controller';

@Global()
@Module({
  controllers: [TenderFileManagerController],
  providers: [TenderFileManagerService],
})
export class TenderFileManagerModule {}
