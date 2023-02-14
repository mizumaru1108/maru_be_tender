export const getOneProposal = `
query getOneProposal($id: String!) {
  proposal: proposal_by_pk(id: $id) {
    id
    project_name
    project_implement_date
    project_location
    project_track
    support_type
    number_of_payments_by_supervisor
    user {
      id
      employee_name
      email
      mobile_number
      roles {
        role {
          id
        }
      }
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
    recommended_supports {
      amount
      clause
      explanation
      id
    }
    amount_required_fsupport
    fsupport_by_supervisor
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
      submitter_role
      content
      created_at
      attachments
      proposal_id
      employee_only
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
    bank_information {
      bank_name
      card_image
      id
      bank_account_name
      bank_account_number
    }
  }
}

`;
