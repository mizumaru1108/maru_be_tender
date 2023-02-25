export type ClientsList = {
  id?: string;
  governorate: string;
  entity: string;
  data_entry_mail: string;
  data_entry_mobile: string;
  total_proposal: number;
  user_id: string;
};

export interface ClientListsRow {
  row: ClientsList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
