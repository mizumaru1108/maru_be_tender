import { TrackEntity } from '../../track/entities/track.entity';

export class ProposalTrackSectionEntity {
  id: string;
  name: string;
  budget: number;
  section_id?: string;
  is_leaf: boolean = false;
  track_id: string;
  is_deleted: boolean = false;
  track_section?: ProposalTrackSectionEntity;
  other_track_section?: ProposalTrackSectionEntity[];
  track: TrackEntity;
}
