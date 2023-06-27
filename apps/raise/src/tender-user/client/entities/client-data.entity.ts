// id                       String       @id(map: "users_pkey")
// entity                   String?      @db.VarChar
// authority                String?      @db.VarChar
// headquarters             String?      @db.VarChar
// date_of_esthablistmen    DateTime?    @db.Date
// num_of_beneficiaries     Int?
// num_of_employed_facility Int?
// governorate              String?
// region                   String?      @db.VarChar
// entity_mobile            String?      @db.VarChar
// center_administration    String?      @db.VarChar
// twitter_acount           String?      @db.VarChar
// phone                    String?      @db.VarChar
// website                  String?      @db.VarChar
// password                 String?      @db.VarChar
// license_number           String?      @db.VarChar
// license_expired          DateTime?    @db.Date
// license_issue_date       DateTime?    @db.Date
// ceo_mobile               String?      @db.VarChar
// ceo_name                 String?      @db.VarChar
// data_entry_mobile        String?      @db.VarChar
// data_entry_name          String?      @db.VarChar
// data_entry_mail          String?      @db.VarChar
// created_at               DateTime?    @default(now()) @db.Timestamp(6)
// updated_at               DateTime?    @default(now()) @db.Timestamp(6)
// client_field             String?      @db.VarChar
// user_id                  String       @unique
// license_file             Json?
// board_ofdec_file         Json?
// chairman_name            String?      @db.VarChar
// chairman_mobile          String?      @db.VarChar
// qid                      Int?
// user                     user         @relation("client_data_user_idTouser", fields: [user_id], references: [id], onDelete: Cascade)

import { UserEntity } from '../../user/entities/user.entity';

export class ClientDataEntity {
  id: string;
  entity?: string | null;
  authority?: string | null;
  headquarters?: string | null;
  date_of_esthablistmen?: Date | null = new Date();
  num_of_beneficiaries?: number | null;
  num_of_employed_facility?: number | null;
  governorate?: string | null;
  region?: string | null;
  entity_mobile?: string | null;
  center_administration?: string | null;
  twitter_acount?: string | null;
  phone?: string | null;
  website?: string | null;
  password?: string | null;
  license_number?: string | null;
  license_expired?: Date | null = new Date();
  license_issue_date?: Date | null = new Date();
  ceo_mobile?: string | null;
  ceo_name?: string | null;
  data_entry_mobile?: string | null;
  data_entry_name?: string | null;
  data_entry_mail?: string | null;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  client_field?: string | null;
  user_id: string;
  license_file?: any; // json
  board_ofdec_file?: any; // json
  chairman_name?: string | null;
  chairman_mobile?: string | null;
  qid?: number | null;
  user: UserEntity;
  client_log: any[];
  // client_log               client_log[]
}
