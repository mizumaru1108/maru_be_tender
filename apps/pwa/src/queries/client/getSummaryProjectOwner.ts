export const getSummaryProjectOwner = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    client_data {
      entity
      region
      governorate
      center_administration
      phone
      license_number
      license_issue_date
      headquarters
      user {
        email
      }
    }
  }
}
`;
