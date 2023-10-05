// id          String    @id(map: "email_history_pkey") @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   title       String    @db.VarChar
//   content     String
//   sender_id   String
//   receiver_id String
//   attachments  Json?
//   created_at  DateTime  @default(now()) @db.Timestamptz(6)
//   updated_at  DateTime  @default(now()) @db.Timestamptz(6)
//   receiver    user      @relation("email_record_receiver_idTouser", fields: [receiver_id], references: [id], onDelete:Restrict, onUpdate: Restrict)
//   sender      user      @relation("email_record_sender_idTouser", fields: [sender_id], references: [id], onDelete: Restrict, onUpdate: Restrict)

import { UserEntity } from '../../tender-user/user/entities/user.entity';

export class EmailRecordEntity {
  id: string;
  title: string;
  content: string;
  attachments: any;
  sender_id: string;
  sender: UserEntity;
  user_on_app: boolean;
  receiver_id?: string | null;
  receiver_name?: string | null;
  receiver_email?: string | null;
  receiver: UserEntity;
  created_at: Date;
  updated_at: Date;
}
