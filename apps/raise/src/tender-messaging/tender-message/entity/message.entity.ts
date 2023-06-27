// id               String         @id
// room_id          String?
// owner_id         String?
// read_status      Boolean?       @default(false)
// created_at       DateTime?      @default(now()) @db.Timestamptz(6)
// updated_at       DateTime?      @default(now()) @db.Timestamptz(6)
// content_type_id  String
// content_title    String?        @db.VarChar
// attachment       Json?
// reply_id         String?
// content          String?
// receiver_id      String?
// sender_role_as   String?
// receiver_role_as String?
// content_type     content_type   @relation(fields: [content_type_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
// sender           user?          @relation(fields: [owner_id], references: [id])
// receiver         user?          @relation("message_receiver_idTouser", fields: [receiver_id], references: [id], onDelete: Restrict, onUpdate: Restrict)
// room_chat        room_chat?     @relation(fields: [room_id], references: [id], onDelete: Cascade)
// notification     notification[]

import { NotificationEntity } from '../../../tender-notification/entities/notification.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';

export class MessageEntity {
  id: string;
  room_id?: string | null;
  owner_id?: string | null;
  read_status?: boolean = false;
  created_at: Date | null = new Date();
  updated_at: Date | null = new Date();
  content_type_id: string;
  content_title?: string | null;
  attachment?: any; //Json?
  reply_id?: string | null;
  content?: string | null;
  receiver_id?: string | null;
  sender_role_as?: string | null;
  receiver_role_as?: string | null;
  // content_type     content_type   @relation(fields: [content_type_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  sender?: UserEntity;
  receiver?: UserEntity;
  // room_chat        ?: RoomChatEntity;
  notification?: NotificationEntity[];
}
