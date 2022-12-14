import { Global, Module } from '@nestjs/common';
import { TenderEventsGateway } from './tender-events.gateway';

@Global()
@Module({
  providers: [TenderEventsGateway],
  exports: [TenderEventsGateway],
})
export class EventsModule {}
