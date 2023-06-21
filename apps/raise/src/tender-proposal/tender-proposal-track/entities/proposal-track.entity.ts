import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { ProposalTrackSectionEntity } from '../../tender-proposal-track-section/entities/proposal-track-section.entity';
import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

// id                String          @id @db.VarChar
// name              String?         @unique
// with_consultation Boolean?        @default(false)
// created_at        DateTime?       @default(now()) @db.Timestamptz(6)
// is_deleted        Boolean?        @default(false)
// proposal          proposal[]
// track_section     track_section[]
// user              user[]
export class ProposalTrackEntity {
  id: string;
  name?: string | null;
  with_consultation?: boolean | null = false;
  created_at?: Date | null = new Date();
  is_deleted?: boolean | null = false;
  proposals?: ProposalEntity[];
  sections?: ProposalTrackSectionEntity[];
  user?: UserEntity[];
}
