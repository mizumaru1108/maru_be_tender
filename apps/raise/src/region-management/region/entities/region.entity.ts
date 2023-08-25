import { GovernorateEntity } from '../../governorate/entities/governorate.entity';

export class RegionEntity {
  region_id: string;
  name: string;
  is_deleted: boolean;
  governorates?: GovernorateEntity[];
}
