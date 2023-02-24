export type ClientsList = {
  id: string;
  entity: string;
  data_entry_mail: string;
  data_entry_mobile: string;
  created_at: Date;
  user_id: string;
};

export interface ClientListsRow {
  row: ClientsList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
