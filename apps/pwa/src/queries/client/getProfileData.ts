export const getProfileData = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    client_data {
      headquarters
      entity
      num_of_beneficiaries
      num_of_employed_facility
      authority
      date_of_esthablistmen
      region
      governorate
      center_administration
      website
      twitter_acount
      phone
      ceo_mobile
      ceo_name
      data_entry_mobile
      data_entry_name
      data_entry_mail
      license_number
      license_expired
      license_issue_date
      license_file
      chairman_name
      chairman_mobile
      entity_mobile
      board_ofdec_file
    }
    bank_informations(where: {is_deleted: {_eq: false}}) {
      bank_account_name
      bank_account_number
      bank_name
      card_image
      is_deleted
      bank_list {
        is_deleted
      }
    }
    email
    status_id
  }
  proposal_aggregate(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: COMPLETED}}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;
