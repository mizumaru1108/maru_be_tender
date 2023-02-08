export const detailsClientData = `
query detailsClientData($id: String!) {
  user_by_pk(id: $id) {
    bank_informations {
        bank_account_name
        bank_account_number
        bank_name
        card_image
        id
        proposal_id
        user_id
      }
    client_data {
      board_ofdec_file
      center_administration
      ceo_mobile
      ceo_name
      created_at
      data_entry_mail
      data_entry_name
      date_of_esthablistmen
      entity
      entity_mobile
      governorate
      headquarters
      id
      license_expired
      license_file
      license_issue_date
      license_number
      num_of_beneficiaries
      num_of_employed_facility
      password
      phone
      region
      twitter_acount
      updated_at
      website
      data_entry_mobile
      chairman_name
      chairman_mobile
      board_ofdec_file
    }
    email
    status_id
  }
}
`;

export const changeClientStatus = `
mutation changeClientStatus($id: String = "", $_set: user_set_input = {}) {
  update_user_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
  }
}
`;

export const deleteClientData = `
mutation changeClientStatus($id: String = "", $_set: user_set_input = {}) {
  update_user_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
  }
}
`;

export const sendAmandmentNotes = `
mutation sendAmandmentNotes($object: client_log_insert_input = {}) {
  insert_client_log_one(object: $object) {
    id
    status
    reviewer_id
    organization_id
    note_account_information
  }
}
`;
