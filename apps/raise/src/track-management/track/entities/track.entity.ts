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
  total_budget: number = 0;
  total_spending_budget: number = 0;
  total_spending_budget_by_ceo: number = 0;
  total_reserved_budget: number = 0;
}
