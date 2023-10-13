export const getOneProposal = `
query getOneProposal($id: String!) {
  proposal: proposal_by_pk(id: $id) {
    id
    project_name
    project_implement_date
    project_location
    project_track
    submitter_user_id
    support_type
    number_of_payments_by_supervisor
    project_number
    pm_name
    pm_email
    pm_mobile
    closing_report
    need_picture
    does_an_agreement
    support_outputs
    vat
    vat_percentage
    inclu_or_exclu
    support_goal_id
    accreditation_type_id
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
        ceo_name
        chairman_name
        entity
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
    supervisor_id
    project_manager_id
    cashier_id
    finance_id
  }
}


`;

export const getInvoicePaymentData = `
query getInvoicePaymentData(
  $proposal_id: String = "",
  $payment_id: String = "",
  $cashier_id: String = "",
  $submitter_user_id: String = ""
  $supervisor_id: String = "",
  $project_manager_id: String = "",
  $finance_id: String = ""
){
  client_name: user_by_pk(id: $submitter_user_id) {
    employee_name
  }
  supervisor_name: user_by_pk(id: $supervisor_id) {
    employee_name
  }
  project_manager_name: user_by_pk(id: $project_manager_id) {
    employee_name
  }
  cashier_name: user_by_pk(id: $cashier_id) {
    employee_name
  }
  finance_name: user_by_pk(id: $finance_id) {
    employee_name
  }
  ceo_name:proposal_log(where: {proposal_id: {_eq: $proposal_id}, reviewer: {roles: {user_type_id: {_eq: CEO}}}}, distinct_on: reviewer_id) {
    reviewer_id
    reviewer {
      employee_name
    }
  }
  payment_details: payment_by_pk(id: $payment_id) {
    id
    payment_amount
    payment_date
    status
    payment_number: cheques {
      id
      number
      payment_id
      transfer_receipt
      deposit_date
    }
  }
}
`;

export const getFinanceName = `query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    employee_name
  }
}
`;

export const getGeneratePaymentData = `
query getInvoicePaymentData(
  $proposal_id: String = "",
  $payment_id: String = "",
  $submitter_user_id: String = ""
  $supervisor_id: String = "",
  $project_manager_id: String = "",
  $finance_id: String = "",
  $cashier_id: String = "",
){
  client_name: user_by_pk(id: $submitter_user_id) {
    employee_name
  }
  supervisor_name: user_by_pk(id: $supervisor_id) {
    employee_name
  }
  project_manager_name: user_by_pk(id: $project_manager_id) {
    employee_name
  }
  finance_name: user_by_pk(id: $finance_id) {
    employee_name
  }
  cashier_name: user_by_pk(id: $cashier_id) {
    employee_name
  }
  ceo_name:proposal_log(where: {proposal_id: {_eq: $proposal_id}, reviewer: {roles: {user_type_id: {_eq: CEO}}}}, distinct_on: reviewer_id) {
    reviewer_id
    reviewer {
      employee_name
    }
  }
  payment_details: payment_by_pk(id: $payment_id) {
    id
    payment_amount
    payment_date
    status
    payment_number: cheques {
      id
      number
      payment_id
      transfer_receipt
      deposit_date
    }
  }
}
`;
