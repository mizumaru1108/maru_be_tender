import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { TrackSectionEntity } from '../../track-section/entities/track.section.entity';

export class SectionSupervisorEntity {
  section_supervisor_id: string;
  section_id: string;
  track_section: TrackSectionEntity;
  supervisor_user_id: string;
  supervisor: UserEntity;
}
