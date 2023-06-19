import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProposalLogEntity {
  // id            String         @id
  // proposal_id   String
  // created_at    DateTime       @default(now()) @db.Timestamptz(6)
  // updated_at    DateTime       @default(now()) @db.Timestamptz(6)
  // reviewer_id   String?
  // state         String
  // notes         String?
  // action        String?        @db.VarChar
  // message       String?        @db.VarChar
  // user_role     String?        @db.VarChar
  // response_time Int?
  // reject_reason String?        @db.VarChar
  // notification  notification[]
  // user_type     user_type      @relation(fields: [state], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_log_assign_fkey")
  // proposal      proposal       @relation(fields: [proposal_id], references: [id], onDelete: Cascade)
  // reviewer      user?          @relation(fields: [reviewer_id], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "proposal_log_user_id_fkey")
  id: string;
  proposal_id: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  reviewer_id?: string;
  state: string;
  notes?: string;
  action?: string;
  message?: string;
  user_role?: string;
  response_time?: number;
  reject_reason?: string;
  reviewer?: UserEntity;
  proposal: ProposalEntity;
  // notification  notification[]
  // user_type     user_type      @relation(fields: [state], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_log_assign_fkey")
}
