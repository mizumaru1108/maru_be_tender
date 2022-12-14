import { Module } from '@nestjs/common';
import { TenderUserModule } from '../tender-user/tender-user.module';
import { TenderMessagesController } from './controllers/tender-messages.controller';
import { TenderMessagesRepository } from './repositories/tender-messages.repository';
import { TenderRoomChatRepository } from './repositories/tender-room-chat.repository';
import { TenderMessagesService } from './services/tender-messages.service';

@Module({
  controllers: [TenderMessagesController],
  providers: [
    TenderMessagesService,
    TenderMessagesRepository,
    TenderRoomChatRepository,
  ],
  imports: [TenderUserModule],
})
export class TenderMessagesModule {}
