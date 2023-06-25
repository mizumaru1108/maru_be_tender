import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { CorrespondanceCategoryEntity } from '../../tender-message/entity/correspondance-category.entity';
import { MessageEntity } from '../../tender-message/entity/message.entity';

export class RoomChatEntity {
  id: string;
  correspondance_category_id: string;
  participant1_user_id?: string | null;
  participant2_user_id?: string | null;
  created_at: Date | null = new Date();
  updated_at: Date | null = new Date();
  message: MessageEntity[];
  correspondance_category: CorrespondanceCategoryEntity;
  user_room_chat_participant1_user_idTouser?: UserEntity;
  user_room_chat_participant2_user_idTouser?: UserEntity;
}
