import { ProposalEntity } from '../../proposal/entities/proposal.entity';

export class ProposalProjectTimelineEntity {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  proposal_id: string;
  proposal?: ProposalEntity;
}
