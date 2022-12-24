import { Module } from '@nestjs/common';
import { TenderMessagesModule } from '../tender-messaging/tender-messages.module';
import { TenderEventsGateway } from './tender-events.gateway';

// @Global()
@Module({
  providers: [TenderEventsGateway],
  exports: [TenderEventsGateway],
  imports: [TenderMessagesModule],
})
export class TenderEventsModule {}
