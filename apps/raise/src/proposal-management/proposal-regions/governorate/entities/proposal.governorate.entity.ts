import { GovernorateEntity } from '../../../../region-management/governorate/entities/governorate.entity';
import { ProposalEntity } from '../../../proposal/entities/proposal.entity';

export class ProposalGovernorateEntity {
  proposal_governorate_id: string;
  proposal_id: string;
  proposal: ProposalEntity;
  governorate_id: string;
  governorate: GovernorateEntity;
  created_at: Date;
}
