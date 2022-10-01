export const getOneProposal = `query MyQuery($id: String!) {
  proposal_by_pk(id: $id) {
    project_name
    project_implement_date
    project_location
    user {
      employee_name
      client_data {
        email
        phone
        region
        governorate
      }
    }
    created_at
    num_ofproject_binicficiaries
    region
    execution_time
    project_idea
    project_goals
    project_outputs
    project_strengths
    project_risks
    bank_informations {
      bank_account_name
      bank_account_number
      bank_name
      card_image
    }
    amount_required_fsupport
    letter_ofsupport_req
    project_attachments
    project_beneficiaries
  }
}
`;
