// export type AuthorityInterface = {
//   id: string;
//   bank_name: string;
//   is_deleted?: boolean;
// };

export type IBeneficiaries = {
  id: string;
  name: string;
  is_deleted?: boolean;
};

export type IRegions = {
  region_id: string;
  name: string;
  is_deleted?: boolean;
  // governorate: IGovernorate[];
};

export interface RegionsFormInput {
  region_id?: string;
  name: string;
}
