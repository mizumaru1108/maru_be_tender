import { ProposalEntity } from '../../tender-proposal/entities/proposal.entity';

export class ProjectTimelineEntity {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  proposal_id: string;
  proposal?: ProposalEntity;
}
