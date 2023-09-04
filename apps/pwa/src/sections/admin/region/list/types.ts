import { IGovernorate } from 'sections/admin/governorate/list/types';

export type IRegions = {
  region_id: string;
  name: string;
  is_deleted?: boolean;
  governorate?: IGovernorate[];
};

export interface RegionsFormInput {
  region_id?: string;
  name: string;
}
