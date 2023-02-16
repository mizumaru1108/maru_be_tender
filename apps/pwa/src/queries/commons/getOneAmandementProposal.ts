export const getOneAmandement = `
query getOneAmandementProposal($id: String!) {
  proposal: proposal_by_pk(id: $id) {
    id
    project_name
    project_implement_date
    project_location
    project_track
    created_at
    num_ofproject_binicficiaries
    project_idea
    project_goals
    project_outputs
    project_strengths
    project_risks
    amount_required_fsupport
    letter_ofsupport_req
    project_attachments
    project_beneficiaries
  }
}
`;
