import { RegionEntity } from '../../region/entities/region.entity';

export class GovernorateEntity {
  governorate_id: string;
  name: string;
  region_id: string;
  region_detail: RegionEntity;
  is_deleted: boolean;
}
