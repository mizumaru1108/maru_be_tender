export const gettingUserDataForEdit = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    client_data {
      client_field
      entity
      authority
      date_of_esthablistmen
      headquarters
      num_of_employed_facility
      num_of_beneficiaries
      region
      governorate
      center_administration
      phone
      twitter_acount
      website
      password
      license_number
      license_issue_date
      license_expired
      license_file
      board_ofdec_file
      ceo_name
      ceo_mobile
      data_entry_name
      data_entry_mobile
      data_entry_mail
      chairman_name
      chairman_mobile
      entity_mobile
    }
    bank_informations {
      bank_account_name
      bank_account_number
      bank_name
      card_image
      id
      is_deleted
      bank_id
    }
    email
  }
}


`;

export const gettingUseInfoForEdit = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    email
  }
}`;

export const gettingUseInfoForEditEmployee = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    mobile_number
    email
    employee_name
  }
}`;
