export type AuthorityInterface = {
  authority_id: string;
  client_field_id: string;
  client_field_details: ClientFieldInterface;
  is_deleted: boolean;
  name: string;
};

export type ClientFieldInterface = {
  client_field_id: string;
  name: string;
  is_deleted: boolean;
};
