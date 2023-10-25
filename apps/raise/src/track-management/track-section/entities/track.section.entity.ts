import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { TrackEntity } from '../../track/entities/track.entity';

export class TrackSectionEntity {
  id: string;
  name: string;
  budget: number;
  parent_section_id: string | null;
  is_leaf: boolean | null;
  track_id: string;
  is_deleted: boolean;
  parent_section: TrackSectionEntity;
  child_track_section: TrackSectionEntity[];
  track: TrackEntity;
  proposal: ProposalEntity[];

  section_budget: number = 0;
  section_spending_budget: number = 0;
  section_reserved_budget: number = 0;
}
