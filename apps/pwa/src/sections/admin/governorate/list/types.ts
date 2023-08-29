import { IRegions } from 'sections/admin/region/list/types';

export type IGovernorate = {
  governorate_id: string;
  name: string;
  is_deleted?: boolean;
  region_id: string;
  region_detail: IRegions;
};

export interface GovernorateFormInput {
  governorate_id?: string;
  region_id?: string;
  is_deleted?: boolean;
  name: string;
}
