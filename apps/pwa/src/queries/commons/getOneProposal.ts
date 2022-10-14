export const getOneProposal = `query MyQuery($id: String!) {
  proposal_by_pk(id: $id) {
    project_name
    project_implement_date
    project_location
    user {
      id
      employee_name
      client_data {
        email
        phone
        region
        governorate
      }
      bank_informations {
        id
        bank_account_name
        bank_account_number
        bank_name
        card_image
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
    inner_status
    outter_status
    state
    payments(order_by: {order: asc}) {
      id
      payment_amount
      payment_date
      status
      order
    }
    number_of_payments
    proposal_item_budgets(where: {proposal_id: {_eq: $id}}) {
      amount
      explanation
      clause
      id
    }
    proposal_item_budgets_aggregate(where: {proposal_id: {_eq: $id}}) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
}
`;
