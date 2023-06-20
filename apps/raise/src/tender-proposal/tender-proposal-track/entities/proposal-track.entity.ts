import { UserEntity } from '../../../tender-auth/entity/user.entity';
import { ProposalTrackSectionEntity } from '../../tender-proposal-track-section/entities/proposal-track-section.entity';
import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProposalTrackEntity {
  id: string;
  name: string;
  with_consultation: boolean = false;
  created_at: Date = new Date();
  is_deleted: boolean = false;
  proposals?: ProposalEntity[];
  sections?: ProposalTrackSectionEntity[];
  user?: UserEntity[];
}
