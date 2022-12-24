export const getOneProposal = `query getOneProposal($id: String!) {
  proposal: proposal_by_pk(id: $id) {
    id
    project_name
    project_implement_date
    project_location
    project_track
    user {
      id
      employee_name
      email
      mobile_number
      client_data {
        region
        governorate
        date_of_esthablistmen
        num_of_beneficiaries
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
      cheques {
        id
        number
        payment_id
        transfer_receipt
        deposit_date
      }
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
    follow_ups: proposal_follow_ups(where: {proposal_id: {_eq: $id}}) {
      id
    action
    created_at
    file
    proposal_id
    user {
      employee_name
      roles {
        role: user_type_id
      }
    }
    }
    added_value
      been_made_before
      been_supported_before
      chairman_of_board_of_directors
    most_clents_projects
      reasons_to_accept
      clause
    remote_or_insite
      supervisor_id
      target_group_age
      target_group_num
      target_group_type
  }
}
`;
// this is added when the recommended_support is added to the proposal table
// recommended_support {
//   amount
//   clause
//   consultant_form_id
//   explanation
//   id
// }
