export const getClientProfile = `query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    bank_informations {
      bank_account_name
      bank_account_number
      bank_name
      card_image
      id
    }
    client_data {
      num_of_beneficiaries
      num_of_employed_facility
      headquarters
      date_of_esthablistmen
      region
      governorate
      center_administration
      website
      twitter_acount
      email
      phone
      entity_mobile
      data_entry_mobile
      data_entry_name
      ceo_mobile
      ceo_name
      data_entry_mail
      license_number
      license_expired
      license_issue_date
      license_file
    }
  }
}
`;
