export const detailsClientData = `
query detailsClientData($id: String!) {
  client_data_by_pk(id: $id) {
    board_ofdec_file
    bank_informations {
      bank_account_name
      bank_account_number
      bank_name
      card_image
      id
      organization_id
      proposal_id
    }
    center_administration
    ceo_mobile
    ceo_name
    created_at
    data_entry_mail
    data_entry_name
    date_of_esthablistmen
    email
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
    status
    twitter_acount
    updated_at
    website
    data_entry_mobile
  }
}
`;

export const activateClientStatus =`
mutation MyMutation(
  $pk_columns: client_data_pk_columns_input = {id: ""}, 
  $_set: client_data_set_input = {}) 
  {
      update_client_data_by_pk(pk_columns: $pk_columns, _set: $_set){
    id
  }
}
`