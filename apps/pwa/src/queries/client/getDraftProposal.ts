export const getDraftProposal = `
query MyQuery($id: String = "") {
  proposal_by_pk(id: $id) {
    id
    project_name
    project_idea
    project_location
    project_implement_date
    execution_time
    project_beneficiaries
    letter_ofsupport_req
    project_attachments
    num_ofproject_binicficiaries
    project_goals
    project_outputs
    project_strengths
    project_risks
    pm_name
    pm_mobile
    pm_email
    region
    governorate
    amount_required_fsupport
    proposal_item_budgets {
      amount
      clause
      explanation
    }
    bank_information {
      bank_account_name
      bank_account_number
      bank_name
      card_image
      id
    }
    step
  }
}
`;
