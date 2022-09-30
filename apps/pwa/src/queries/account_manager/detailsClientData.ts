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
    mobile_data_entry
    num_of_beneficiaries
    num_of_employed_facility
    password
    phone
    region
    status
    twitter_acount
    updated_at
    website
  }
}
`;