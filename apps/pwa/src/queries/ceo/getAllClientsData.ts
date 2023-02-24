export const allClientData = `query allClientData ($limit: Int = 10, $offset: Int = 10) {
  client_data(limit: $limit, offset: $offset) {
    id
    entity
    data_entry_mail
    data_entry_mobile
    created_at
    user_id
  }

  total: client_data_aggregate {
    aggregate {
      count
    }
  }
}`;

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
