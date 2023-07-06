import { ProposalTrackSectionEntity } from '../../section/entities/proposal-track-section.entity';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';

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
