export const getProposalClosingReport = `
query getClosingReport($proposal_id: String = "") {
  proposal_closing_report(where: {proposal_id: {_eq: $proposal_id}}) {
    id
    proposal_id
    attachments
    created_at
    execution_place
    gender
    images
    number_of_beneficiaries
    number_of_staff
    number_of_volunteer
    project_duration
    project_repeated
    target_beneficiaries
    updated_at
  }
}
`;
