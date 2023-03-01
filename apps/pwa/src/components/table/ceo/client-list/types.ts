export type ClientsList = {
  id?: string;
  governorate: string;
  client_name: string;
  email: string;
  number_phone: string;
  total_proposal: number;
  user_id: string;
};

export interface ClientListsRow {
  row: ClientsList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
