import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { ProposalTrackSectionEntity } from '../../section/entities/proposal-track-section.entity';
import { ProposalEntity } from '../../../tender-proposal/tender-proposal/entities/proposal.entity';

export class TrackEntity {
  id: string;
  name?: string | null;
  with_consultation?: boolean | null = false;
  created_at?: Date | null = new Date();
  is_deleted?: boolean | null = false;
  proposals?: ProposalEntity[];
  sections?: ProposalTrackSectionEntity[];
  user?: UserEntity[];
}
