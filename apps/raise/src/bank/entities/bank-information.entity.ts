// user_id                                              String
// bank_account_name                                    String?    @db.VarChar
// bank_account_number                                  String?    @db.VarChar
// bank_name                                            String?    @db.VarChar
// proposal_id                                          String?
// id                                                   String     @id @unique @default(dbgenerated("gen_random_uuid()")) @db.Uuid
// card_image                                           Json?
// is_deleted                                           Boolean?   @default(false)
// bank_id                                              String?    @db.VarChar
// created_at                                           DateTime?  @default(now()) @db.Timestamptz(6)
// updated_at                                           DateTime?  @default(now()) @db.Timestamptz(6)
// user                                                 user       @relation(fields: [user_id], references: [id], onDelete: Cascade)

import { ProposalEntity } from '../../tender-proposal/tender-proposal/entities/proposal.entity';
import { UserEntity } from '../../tender-user/user/entities/user.entity';

export class BankInformationEntity {
  id: string;
  user_id: string;
  bank_account_name?: string | null;
  bank_account_number?: string | null;
  bank_name?: string | null;
  proposal_id?: string | null;
  card_image?: any; //Json?
  is_deleted?: boolean | null;
  bank_id?: string | null;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  user: UserEntity;
  proposal_bank_informationToproposal_proposal_bank_id?: ProposalEntity;
}
