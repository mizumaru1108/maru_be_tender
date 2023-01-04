import { Global, Module } from '@nestjs/common';
import { TenderNotificationController } from './controllers/tender-notification.controller';
import { TenderNotificationService } from './services/tender-notification.service';

@Global()
@Module({
  controllers: [TenderNotificationController],
  providers: [TenderNotificationService],
})
export class TenderNotificationModule {}
