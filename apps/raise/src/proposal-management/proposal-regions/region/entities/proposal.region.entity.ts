import { RegionEntity } from '../../../../region-management/region/entities/region.entity';
import { ProposalEntity } from '../../../proposal/entities/proposal.entity';

export class ProposalRegionEntity {
  proposal_region_id: string;
  proposal_id: string;
  proposal: ProposalEntity;
  region_id: string;
  region: RegionEntity;
  created_at: Date;
}
