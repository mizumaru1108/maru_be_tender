import { Global, Module } from '@nestjs/common';
import { TenderNotificationController } from './controllers/tender-notification.controller';
import { TenderNotificationRepository } from './repository/tender-notification.repository';
import { TenderNotificationService } from './services/tender-notification.service';

@Global()
@Module({
  controllers: [TenderNotificationController],
  providers: [TenderNotificationService, TenderNotificationRepository],
  exports: [TenderNotificationService],
})
export class TenderNotificationModule {}
