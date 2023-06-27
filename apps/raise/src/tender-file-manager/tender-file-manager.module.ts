import { Global, Module } from '@nestjs/common';
import { TenderFileManagerService } from './services/tender-file-manager.service';
import { TenderFileManagerController } from './controllers/tender-file-manager.controller';
import { TenderFileManagerRepository } from './repositories/tender-file-manager.repository';

@Global()
@Module({
  controllers: [TenderFileManagerController],
  providers: [TenderFileManagerService, TenderFileManagerRepository],
  exports: [TenderFileManagerService, TenderFileManagerRepository],
})
export class TenderFileManagerModule {}
