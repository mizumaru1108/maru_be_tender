import { Module } from '@nestjs/common';
import { UserModule } from '../tender-user/user/user.module';
import { TenderMessagesController } from './tender-message/controllers/tender-messages.controller';
import { TenderMessagesRepository } from './tender-message/repositories/tender-messages.repository';
import { TenderMessagesService } from './tender-message/services/tender-messages.service';
import { TenderRoomChatController } from './tender-room-chat/controllers/tender-room-chat.controller';
import { TenderRoomChatRepository } from './tender-room-chat/repositories/tender-room-chat.repository';
import { TenderRoomChatService } from './tender-room-chat/services/tender-room-chat.service';

@Module({
  controllers: [TenderMessagesController, TenderRoomChatController],
  providers: [
    // messages
    TenderMessagesService,
    TenderMessagesRepository,
    // room chat
    TenderRoomChatService,
    TenderRoomChatRepository,
  ],
  imports: [UserModule],
  exports: [TenderMessagesService, TenderRoomChatService],
})
export class TenderMessagesModule {}
