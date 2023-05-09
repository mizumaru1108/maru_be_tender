//exclude user role client
// export const getProposalLog = `
// query getProposalLog($proposal_id: String = "") {
//   log: proposal_log(where: {proposal_id: {_eq: $proposal_id}, user_role: {_neq: "CLIENT"}}, order_by: {created_at: asc}) {
//     id
//     action
//     message
//     notes
//     created_at
//     user_role
//     reviewer {
//       employee_name
//     }
//     proposal: proposal {
//       inclu_or_exclu
//       does_an_agreement
//       closing_report
//       clasification_field
//       clause
//       support_outputs
//       vat
//       vat_percentage
//       support_goal_id
//       support_type
//       number_of_payments_by_supervisor
//       need_picture
//       fsupport_by_supervisor
//       updated_at
//       created_at
//       state
//       project_track
//     }
//   }
// }
// `;

// include user role client
export const getProposalLog = `
query getProposalLog($proposal_id: String = "") {
  log: proposal_log(where: {proposal_id: {_eq: $proposal_id}, action: {_is_null: false}, user_role: {_is_null: false}}, order_by: {created_at: asc}) {
    id
    action
    message
    notes
    created_at
    user_role
    reviewer {
      employee_name
    }
    proposal: proposal {
      inclu_or_exclu
      does_an_agreement
      closing_report
      clasification_field
      clause
      support_outputs
      vat
      vat_percentage
      support_goal_id
      support_type
      number_of_payments_by_supervisor
      need_picture
      fsupport_by_supervisor
      updated_at
      created_at
      state
      project_track
      track_id
    }
  }
}

`;

export const getProposalLogGrants = `
query getProposalLog($proposal_id: String = "") {
  proposal: proposal_by_pk(id: $proposal_id) {
    accreditation_type_id
    added_value
    been_made_before
    been_supported_before
    chairman_of_board_of_directors
    clasification_field
    clause
    closing_report
    does_an_agreement
    fsupport_by_supervisor
    inclu_or_exclu
    need_picture
    number_of_payments_by_supervisor
    reasons_to_accept
    remote_or_insite
    support_goal_id
    support_outputs
    support_type
    target_group_age
    target_group_num
    target_group_type
    vat
    vat_percentage
    most_clents_projects
  }
}
`;
