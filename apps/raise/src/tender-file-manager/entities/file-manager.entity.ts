// model file_manager {
//   id                  String   @id
//   name                String   @db.VarChar
//   size                Decimal  @db.Decimal
//   mimetype            String   @db.VarChar
//   url                 String   @unique @db.VarChar
//   table_name          String?  @db.VarChar
//   column_name         String?  @db.VarChar
//   user_id             String?
//   is_deleted          Boolean  @default(false)
//   created_at          DateTime @default(now()) @db.Timestamptz(6)
//   updated_at          DateTime @default(now()) @db.Timestamptz(6)
//   proposal_id         String?
//   bank_information_id String?
//   fid                 Int?
//   user                user?    @relation(fields: [user_id], references: [id], onDelete: Cascade)
// }

import { UserEntity } from '../../tender-auth/entity/user.entity';

export class FileManagerEntity {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  url: string;
  table_name?: string | null;
  column_name?: string | null;
  user_id?: string | null;
  is_deleted: boolean = false;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  proposal_id?: string | null;
  bank_information_id?: string | null;
  fid?: number | null;
  user?: UserEntity;
}
