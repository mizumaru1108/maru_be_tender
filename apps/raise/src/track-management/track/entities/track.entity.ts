import { TrackSectionEntity } from '../../track-section/entities/track.section.entity';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';

export class TrackEntity {
  id: string;
  name?: string | null;
  with_consultation?: boolean | null = false;
  created_at?: Date | null = new Date();
  is_deleted?: boolean | null = false;
  proposals?: ProposalEntity[];
  sections?: TrackSectionEntity[];
  user?: UserEntity[];

  // virtual props by query/sum
  budget?: number;
  total_budget_used?: number;
  remaining_budget?: number;
}
