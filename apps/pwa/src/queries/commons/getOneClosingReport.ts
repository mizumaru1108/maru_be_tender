export const getOneClosingReport = `
query MyQuery( $id: String = "") {
  proposal_closing_report(where: {proposal_id: {_eq: $id}}) {
    attachments
    created_at
    execution_place
    gender
    id
    images
    number_of_beneficiaries
    number_of_staff
    number_of_volunteer
    project_duration
    project_repeated
    target_beneficiaries
  }
}

`;
